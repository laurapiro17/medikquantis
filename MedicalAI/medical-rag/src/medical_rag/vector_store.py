"""ChromaDB vector store management and text chunking for medical_rag."""

from typing import List, Dict, Any
import chromadb
from chromadb.utils import embedding_functions

from medical_rag.config import settings
from medical_rag.schemas import PubMedArticle, DocumentChunk, SearchResult


def chunk_article(article: PubMedArticle, chunk_size: int = 400) -> List[DocumentChunk]:
    """Split an article's abstract into chunks suitable for embedding.

    Args:
        article: The PubMedArticle to chunk.
        chunk_size: Target characters per chunk.

    Returns:
        List of DocumentChunk instances.
    """
    paragraphs = [p.strip() for p in article.abstract.split("\n") if p.strip()]
    if not paragraphs:
        paragraphs = [article.abstract]

    chunks: List[DocumentChunk] = []
    chunk_idx = 0

    current_text = ""
    for para in paragraphs:
        if len(current_text) + len(para) > chunk_size and current_text:
            chunks.append(
                DocumentChunk(
                    chunk_id=f"{article.pmid}_{chunk_idx}",
                    pmid=article.pmid,
                    title=article.title,
                    journal=article.journal,
                    pub_year=article.pub_year,
                    text=current_text,
                    chunk_index=chunk_idx,
                )
            )
            chunk_idx += 1
            current_text = para
        else:
            current_text = f"{current_text}\n{para}".strip() if current_text else para

    if current_text:
        chunks.append(
            DocumentChunk(
                chunk_id=f"{article.pmid}_{chunk_idx}",
                pmid=article.pmid,
                title=article.title,
                journal=article.journal,
                pub_year=article.pub_year,
                text=current_text,
                chunk_index=chunk_idx,
            )
        )

    return chunks


class MedicalVectorStore:
    """Manager for ChromaDB persistent collection storing medical literature."""

    def __init__(self, collection_name: str = "pubmed_articles"):
        self.client = chromadb.PersistentClient(path=str(settings.CHROMA_DB_DIR))
        try:
            self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name=settings.EMBEDDING_MODEL_NAME
            )
        except Exception:
            self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()

        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn,
        )

    def add_articles(self, articles: List[PubMedArticle]) -> int:
        """Chunk articles and add them to the vector store.

        Args:
            articles: List of PubMedArticle objects.

        Returns:
            Total number of chunks added.
        """
        if not articles:
            return 0

        ids: List[str] = []
        documents: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        total_chunks = 0
        for article in articles:
            chunks = chunk_article(article)
            for chunk in chunks:
                ids.append(chunk.chunk_id)
                # Combine title context with chunk text for better semantic match
                documents.append(f"Title: {chunk.title}\n{chunk.text}")
                metadatas.append(
                    {
                        "pmid": chunk.pmid,
                        "title": chunk.title,
                        "journal": chunk.journal,
                        "pub_year": chunk.pub_year,
                        "doi": article.doi or "",
                        "chunk_index": chunk.chunk_index,
                    }
                )
                total_chunks += 1

        if ids:
            self.collection.upsert(
                ids=ids,
                documents=documents,
                metadatas=metadatas,
            )

        return total_chunks

    def search(self, query: str, top_k: int = 5) -> List[SearchResult]:
        """Search vector store for relevant chunks given a clinical query.

        Args:
            query: Clinical question or search query.
            top_k: Number of top results to return.

        Returns:
            List of SearchResult objects sorted by relevance.
        """
        if not query.strip() or self.collection.count() == 0:
            return []

        results = self.collection.query(
            query_texts=[query],
            n_results=min(top_k, self.collection.count()),
        )

        search_results: List[SearchResult] = []
        if results and results.get("ids") and results["ids"][0]:
            ids = results["ids"][0]
            documents = results["documents"][0] if results.get("documents") else []
            distances = results["distances"][0] if results.get("distances") else []
            metadatas = results["metadatas"][0] if results.get("metadatas") else []

            for chunk_id, doc, dist, meta in zip(ids, documents, distances, metadatas):
                search_results.append(
                    SearchResult(
                        chunk_id=chunk_id,
                        pmid=meta.get("pmid", ""),
                        text=doc,
                        distance=float(dist) if dist is not None else 0.0,
                        metadata=meta,
                    )
                )

        return search_results

    def count(self) -> int:
        """Return total number of chunks stored."""
        return self.collection.count()
