"""Tests for medical_rag article chunking logic."""

from medical_rag.schemas import PubMedArticle
from medical_rag.vector_store import chunk_article


def test_chunk_article():
    article = PubMedArticle(
        pmid="10001",
        title="Test Article Title",
        abstract="Paragraph 1 text about clinical trials.\nParagraph 2 text about primary outcomes.\nParagraph 3 text about safety results.",
        journal="Test Journal",
        pub_year="2024",
    )

    chunks = chunk_article(article, chunk_size=50)
    assert len(chunks) >= 2
    assert chunks[0].pmid == "10001"
    assert chunks[0].title == "Test Article Title"
    assert chunks[0].chunk_index == 0
