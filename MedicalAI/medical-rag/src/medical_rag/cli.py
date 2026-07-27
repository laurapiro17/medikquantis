"""Typer CLI interface for medical_rag."""

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.markdown import Markdown

from medical_rag.config import settings
from medical_rag.rag_engine import MedicalRAGEngine
from medical_rag.vector_store import MedicalVectorStore

app = typer.Typer(
    name="medrag",
    help="Evidence-grounded RAG over PubMed for cardiology clinical questions.",
    add_completion=False,
)
console = Console()


@app.command()
def ingest(
    topic: str = typer.Argument(..., help="Clinical search topic or term (e.g. 'CHA2DS2-VASc stroke risk')"),
    max_results: int = typer.Option(15, "--max-results", "-m", help="Maximum articles to fetch from PubMed"),
):
    """Fetch literature from PubMed and index into vector store."""
    console.print(f"[bold blue]Searching PubMed for:[/bold blue] '{topic}'...")

    engine = MedicalRAGEngine()
    chunks_added = engine.ingest_topic(topic, max_results=max_results)

    console.print(
        f"[bold green]✓ Ingestion complete![/bold green] Added [bold]{chunks_added}[/bold] text chunks to ChromaDB."
    )
    console.print(f"Total chunks in DB: [bold]{engine.vector_store.count()}[/bold]")


@app.command()
def query(
    question: str = typer.Argument(..., help="Clinical question to answer"),
    top_k: int = typer.Option(5, "--top-k", "-k", help="Number of evidence excerpts to retrieve"),
    auto_fetch: bool = typer.Option(True, "--auto-fetch/--no-auto-fetch", help="Auto-fetch PubMed if DB is empty"),
):
    """Answer a clinical question with evidence-grounded PubMed citations."""
    console.print(f"\n[bold cyan]Clinical Question:[/bold cyan] {question}\n")

    with console.status("[bold green]Searching evidence & generating response...[/bold green]"):
        engine = MedicalRAGEngine()
        result = engine.answer_query(question, top_k=top_k, auto_fetch=auto_fetch)

    # Render Answer Panel
    console.print(
        Panel(
            Markdown(result.answer),
            title="[bold green]Evidence-Grounded Answer[/bold green]",
            border_style="green",
        )
    )

    # Render Citations Table
    if result.citations:
        table = Table(title="Retrieved Citations & References", show_header=True, header_style="bold magenta")
        table.add_column("PMID", style="cyan", width=10)
        table.add_column("Title", style="white")
        table.add_column("Journal (Year)", style="dim")
        table.add_column("DOI", style="yellow")

        for cit in result.citations:
            table.add_row(
                cit.pmid,
                cit.title,
                f"{cit.journal} ({cit.pub_year})",
                cit.doi or "N/A",
            )

        console.print(table)
    else:
        console.print("[yellow]No citations retrieved.[/yellow]")


@app.command()
def status():
    """Show current vector database status and configuration."""
    store = MedicalVectorStore()
    total_chunks = store.count()

    table = Table(title="Medical RAG Engine Status", show_header=True, header_style="bold cyan")
    table.add_column("Setting", style="white")
    table.add_column("Value", style="green")

    table.add_row("Chroma DB Path", str(settings.CHROMA_DB_DIR))
    table.add_row("Total Indexed Chunks", str(total_chunks))
    table.add_row("Embedding Model", settings.EMBEDDING_MODEL_NAME)
    table.add_row("Anthropic Model", settings.ANTHROPIC_MODEL)
    table.add_row("Anthropic API Key", "Set ✓" if settings.ANTHROPIC_API_KEY else "Not Set ✗ (Demo mode)")
    table.add_row("NCBI Email", settings.NCBI_EMAIL)

    console.print(table)


if __name__ == "__main__":
    app()
