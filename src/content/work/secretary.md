---
title: Secretary
dwg: JW-203
discipline: software
year: "2026"
status: in-progress
rev: A
summary: A local-first LLM agent harness over my notes vault. The model is the brain, and one small read-only module is the only thing touching disk.
role: Solo — design, implementation
stack: [Python, OpenAI SDK, OpenRouter, uv, Rich]
order: 5
featured: true
---

## Problem

My notes live in an Obsidian vault, and I wanted an assistant that could triage the inbox and answer questions against it. I didn't want to hand a model, or a framework I couldn't read, open access to everything I've written. I also wanted to compare small and open models honestly, including quantized ones, before committing to running one locally.

## Approach

I built it outside work. The design premise is that the model is only the brain and the harness is the hands: it decides what text the model sees, runs any tool the model asks for, and logs everything.

**The security boundary is one module.** `vault.py` is the only code that touches disk, and it is read-only. Every tool the model can call is a thin wrapper over it.

- **Exclusions are structural.** Folders listed in `exclude_folders` are filtered at enumeration time. They never show up in a listing, a search hit, or a resolved note name, so the model can't ask for what it can't see.
- **Redaction before egress.** Card-number shapes and CVV/CID codes are scrubbed from every note and search snippet before the text leaves the machine. URL spans are skipped, so long IDs aren't mistaken for cards.
- **The model never runs code.** Tools are JSON schemas. The dispatcher maps three names (`read_note`, `search_vault`, `list_folder`) to Python functions and returns strings. Unknown tools and malformed arguments come back as error strings, not exceptions.

```python
# Once the tool budget is spent, stop offering tools at all: the model has to answer.
offered = tools if (tools and budget_left > 0) else None
```

**The agent loop is visible.** About 60 lines: call the model, run the requested tools, and repeat. There is a cap on turns and a separate cap on tool calls. When the tool budget runs out, the loop withdraws tools and tells the model to answer. Every tool call ID still gets a reply, so the next request is never malformed.

**Jobs are propose-only.** Inbox triage builds a compact prompt from the vault map and the inbox, then parses the model's JSON reply into a table. Nothing writes back to the vault.

**Comparison is built in.** One prompt can fan out to several models through OpenRouter. A quantization filter routes only to providers serving, say, 4-bit weights. Every run's tokens, cost, latency, and full transcript are appended to JSONL logs.

## Result

A working CLI that covers model comparison, inbox triage across several models side by side, free-form vault questions, and model-free tool testing. It runs on hosted models today. The client is OpenAI-compatible, so local hardware can replace the backend later.

## Notes

- I kept the loop free of frameworks on purpose. When a small model fails, I can read exactly what it was sent and what it said back.
