"""PubMed client using BioPython Entrez for medical paper retrieval."""

from typing import List, Optional
from Bio import Entrez
import xml.etree.ElementTree as ET

from medical_rag.config import settings
from medical_rag.schemas import PubMedArticle

# Set Entrez credentials
Entrez.email = settings.NCBI_EMAIL
if settings.NCBI_API_KEY:
    Entrez.api_key = settings.NCBI_API_KEY


def search_pubmed(query: str, max_results: int = 15) -> List[str]:
    """Search PubMed for a given query and return a list of PMIDs.

    Args:
        query: Search term or clinical topic.
        max_results: Maximum number of PMIDs to return.

    Returns:
        List of PMID strings.
    """
    if not query.strip():
        return []

    handle = Entrez.esearch(
        db="pubmed",
        term=query,
        retmax=max_results,
        sort="relevance",
    )
    record = Entrez.read(handle)
    handle.close()
    return record.get("IdList", [])


def parse_article_xml(article_elem: ET.Element) -> Optional[PubMedArticle]:
    """Parse a single PubmedArticle XML Element into a PubMedArticle schema.

    Args:
        article_elem: XML Element corresponding to a PubmedArticle tag.

    Returns:
        PubMedArticle instance or None if parsing fails.
    """
    try:
        medline = article_elem.find("MedlineCitation")
        if medline is None:
            return None

        # PMID
        pmid_elem = medline.find("PMID")
        if pmid_elem is None or not pmid_elem.text:
            return None
        pmid = pmid_elem.text.strip()

        article = medline.find("Article")
        if article is None:
            return None

        # Title
        title_elem = article.find("ArticleTitle")
        title = "".join(title_elem.itertext()).strip() if title_elem is not None else "No Title"

        # Abstract
        abstract_elem = article.find("Abstract")
        abstract_text = ""
        if abstract_elem is not None:
            texts = []
            for text_node in abstract_elem.findall("AbstractText"):
                label = text_node.attrib.get("Label", "")
                node_content = "".join(text_node.itertext()).strip()
                if label:
                    texts.append(f"{label}: {node_content}")
                else:
                    texts.append(node_content)
            abstract_text = "\n".join(texts)

        # Skip articles without an abstract
        if not abstract_text:
            return None

        # Journal Title
        journal_elem = article.find("Journal/Title")
        if journal_elem is None:
            journal_elem = article.find("Journal/ISOAbbreviation")
        journal = journal_elem.text.strip() if journal_elem is not None and journal_elem.text else "Unknown Journal"

        # Publication Year
        pub_date = article.find("Journal/JournalIssue/PubDate")
        pub_year = "Unknown Year"
        if pub_date is not None:
            year_elem = pub_date.find("Year")
            if year_elem is not None and year_elem.text:
                pub_year = year_elem.text.strip()
            else:
                medline_date = pub_date.find("MedlineDate")
                if medline_date is not None and medline_date.text:
                    pub_year = medline_date.text.strip()[:4]

        # Authors
        authors = []
        author_list = article.find("AuthorList")
        if author_list is not None:
            for author in author_list.findall("Author"):
                last_name = author.findtext("LastName", "")
                initials = author.findtext("Initials", "")
                if last_name:
                    authors.append(f"{last_name} {initials}".strip())

        # DOI
        doi = None
        for eloc in article.findall("ELocationID"):
            if eloc.attrib.get("EIdType") == "doi":
                doi = eloc.text.strip()
                break

        # Keywords / MeSH
        keywords = []
        mesh_heading_list = medline.find("MeshHeadingList")
        if mesh_heading_list is not None:
            for heading in mesh_heading_list.findall("MeshHeading/DescriptorName"):
                if heading.text:
                    keywords.append(heading.text.strip())

        return PubMedArticle(
            pmid=pmid,
            title=title,
            abstract=abstract_text,
            journal=journal,
            pub_year=pub_year,
            authors=authors,
            doi=doi,
            keywords=keywords,
        )

    except Exception:
        return None


def fetch_articles(pmids: List[str]) -> List[PubMedArticle]:
    """Fetch and parse detailed PubMed XML for a list of PMIDs.

    Args:
        pmids: List of PubMed ID strings.

    Returns:
        List of PubMedArticle objects.
    """
    if not pmids:
        return []

    handle = Entrez.efetch(
        db="pubmed",
        id=",".join(pmids),
        rettype="xml",
        retmode="xml",
    )
    xml_data = handle.read()
    handle.close()

    root = ET.fromstring(xml_data)
    articles = []
    for article_elem in root.findall(".//PubmedArticle"):
        parsed = parse_article_xml(article_elem)
        if parsed:
            articles.append(parsed)

    return articles


def fetch_and_search_pubmed(query: str, max_results: int = 15) -> List[PubMedArticle]:
    """Convenience function to search PubMed and immediately fetch parsed articles.

    Args:
        query: Clinical topic or search term.
        max_results: Max articles to retrieve.

    Returns:
        List of PubMedArticle instances.
    """
    pmids = search_pubmed(query, max_results=max_results)
    return fetch_articles(pmids)
