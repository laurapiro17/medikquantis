"""Data models and schemas for medical_rag."""

from typing import List, Optional
from pydantic import BaseModel, Field


class PubMedArticle(BaseModel):
    """Schema representing a parsed PubMed article."""

    pmid: str = Field(description="PubMed Unique Identifier")
    title: str = Field(description="Article title")
    abstract: str = Field(description="Abstract text")
    journal: str = Field(default="Unknown Journal", description="Journal title")
    pub_year: str = Field(default="Unknown Year", description="Year of publication")
    authors: List[str] = Field(default_factory=list, description="Author names")
    doi: Optional[str] = Field(default=None, description="Digital Object Identifier")
    keywords: List[str] = Field(default_factory=list, description="Article mesh/keywords")


class DocumentChunk(BaseModel):
    """Schema for a chunk of text derived from an article for vector indexing."""

    chunk_id: str = Field(description="Unique ID for the chunk (e.g. pmid_chunkindex)")
    pmid: str = Field(description="Source PubMed ID")
    title: str = Field(description="Source article title")
    journal: str = Field(description="Source journal")
    pub_year: str = Field(description="Publication year")
    text: str = Field(description="Text segment content")
    chunk_index: int = Field(description="Index of this chunk within the article")


class Citation(BaseModel):
    """Schema for a citation referenced in RAG answers."""

    pmid: str
    title: str
    journal: str
    pub_year: str
    doi: Optional[str] = None


class SearchResult(BaseModel):
    """Schema for a retrieved chunk from vector search."""

    chunk_id: str
    pmid: str
    text: str
    distance: float
    metadata: dict


class RAGResponse(BaseModel):
    """Schema for the final RAG answer output."""

    query: str
    answer: str
    citations: List[Citation]
    retrieved_chunks: List[SearchResult]
