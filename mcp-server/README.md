# MedikQuantis MCP server

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes
the open, free **MedikQuantis clinical-calculator API** as tools for AI agents
and copilots.

Instead of letting a language model do clinical arithmetic itself (and
hallucinate cut-offs), it calls a verifiable endpoint that returns the score,
risk tier, recommendation, evidence grade and the **primary-literature
references (with PMIDs)** for every result.

This is the "unfair advantage" MDCalc structurally can't offer: MDCalc is a
login-walled garden; MedikQuantis is an open API, so it can be the verifiable
calculation backend of the medical-AI ecosystem.

## Tools

| Tool | Purpose |
| --- | --- |
| `list_calculators` | Discover available scores (optional specialty filter). |
| `describe_calculator` | Get a calculator's input JSON Schema + references. |
| `calculate` | Compute one score → result + cited references. |
| `calculate_batch` | Compute up to 50 scores in one call. |

Recommended agent flow: **list → describe → calculate**.

## Run

```bash
npm install      # or pnpm install --ignore-workspace
npm run build
node dist/index.js
```

The server speaks JSON-RPC over stdio. By default it targets the production API
(`https://medikquantis.me/api/v1`); override with:

```bash
MEDIKQUANTIS_API_BASE=http://localhost:3000/api/v1 node dist/index.js
```

## Use with an MCP client (e.g. Claude Desktop)

Add to the client's MCP config:

```json
{
  "mcpServers": {
    "medikquantis": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

Then ask the agent, e.g.: *"Compute the CHA₂DS₂-VASc for a 75-year-old woman
with heart failure and hypertension and cite the guideline."* It will call
`describe_calculator` then `calculate` and return the score with the ESC
reference.

## Safety

Decision support, not a substitute for clinical judgement. No patient data is
stored — the server is a stateless proxy over the public HTTP API.

License: MIT.
