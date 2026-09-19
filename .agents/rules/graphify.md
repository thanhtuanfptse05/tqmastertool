---
trigger: always_on
description: Consult CodeGraph and Graphify for code exploration, symbol navigation, and codebase architecture questions.
---

## CodeGraph & Graphify Code Exploration

This project is indexed by **CodeGraph** (`.codegraph/`) and has a **Graphify** knowledge graph (`graphify-out/`).

Rules:
- **CodeGraph First**: Reach for `codegraph_explore` (MCP) or `codegraph explore "<symbols or questions>"` BEFORE grep/find or raw file reading to understand symbol definitions, call hierarchies, and multi-hop execution flow.
- **Graphify for Architecture & Dependencies**: When `graphify-out/graph.json` exists, run `graphify query "<question>"` (CLI) or `query_graph` (MCP). Use `graphify path "<A>" "<B>"` / `shortest_path` for relationships and `graphify explain "<concept>"` / `get_node` for focused concepts.
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- **Graph Update**: After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost).
