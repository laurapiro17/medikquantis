"""Tests for medical_rag PubMed XML parser."""

import xml.etree.ElementTree as ET
from medical_rag.pubmed import parse_article_xml

SAMPLE_PUBMED_XML = """
<PubmedArticle>
    <MedlineCitation Status="MEDLINE" Owner="NLM">
        <PMID Version="1">22246443</PMID>
        <Article PubModel="Print-Electronic">
            <Journal>
                <ISOAbbreviation>Eur Heart J</ISOAbbreviation>
                <Title>European Heart Journal</Title>
                <JournalIssue PrintYN="Y">
                    <PubDate>
                        <Year>2012</Year>
                        <Month>Jun</Month>
                    </PubDate>
                </JournalIssue>
            </Journal>
            <ArticleTitle>Evaluation of risk stratification schemes for ischaemic stroke and bleeding in 182,678 patients with atrial fibrillation.</ArticleTitle>
            <Pagination>
                <MedlinePgn>1500-1510</MedlinePgn>
            </Pagination>
            <Abstract>
                <AbstractText Label="BACKGROUND">Stroke prevention in atrial fibrillation is crucial.</AbstractText>
                <AbstractText Label="METHODS">Nationwide cohort study in Sweden.</AbstractText>
                <AbstractText Label="RESULTS">CHA2DS2-VASc score predicted stroke risk accurately.</AbstractText>
            </Abstract>
            <AuthorList CompleteYN="Y">
                <Author ValidYN="Y">
                    <LastName>Friberg</LastName>
                    <Initials>L</Initials>
                </Author>
                <Author ValidYN="Y">
                    <LastName>Rosenqvist</LastName>
                    <Initials>M</Initials>
                </Author>
                <Author ValidYN="Y">
                    <LastName>Lip</LastName>
                    <Initials>GY</Initials>
                </Author>
            </AuthorList>
            <ELocationID EIdType="doi" ValidYN="Y">10.1093/eurheartj/ehr488</ELocationID>
        </Article>
    </MedlineCitation>
</PubmedArticle>
"""


def test_parse_article_xml():
    elem = ET.fromstring(SAMPLE_PUBMED_XML)
    article = parse_article_xml(elem)

    assert article is not None
    assert article.pmid == "22246443"
    assert "Evaluation of risk stratification schemes" in article.title
    assert "BACKGROUND: Stroke prevention" in article.abstract
    assert "RESULTS: CHA2DS2-VASc score" in article.abstract
    assert article.journal == "European Heart Journal"
    assert article.pub_year == "2012"
    assert article.doi == "10.1093/eurheartj/ehr488"
    assert len(article.authors) == 3
    assert article.authors[0] == "Friberg L"
