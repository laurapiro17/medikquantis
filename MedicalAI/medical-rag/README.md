# medical-rag

Evidence-grounded Retrieval-Augmented Generation (RAG) system over PubMed for cardiology and clinical queries.

## Features
- 🔍 **PubMed Ingestion**: Direct search & XML parsing via BioPython Entrez API.
- ⚡ **Local Vector Store**: Persistent ChromaDB indexing using HuggingFace `sentence-transformers`.
- 🧬 **Evidence-Grounded RAG**: Strictly cited answers using Anthropic Claude with `[PMID: xxx]` inline references.
- 💻 **CLI & Rich UI**: Command-line interface built with Typer and Rich formatting.

## Installation

```bash
pip install -e .
```

Or for development / demo mode:

```bash
pip install -e ".[dev,demo]"
```

## Setup Environment Variables

Create a `.env` file or export environment variables:

```env
ANTHROPIC_API_KEY=your-anthropic-key-here
NCBI_EMAIL=your-email@example.com
```

## CLI Usage

### 1. Check Status
```bash
medrag status
```

### 2. Ingest PubMed Literature
```bash
medrag ingest "CHA2DS2-VASc stroke risk" --max-results 15
```

### 3. Query Clinical RAG System
```bash
medrag query "What is the annual stroke risk for a CHA2DS2-VASc score of 3?"
```

## License
MIT
