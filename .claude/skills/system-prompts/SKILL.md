---
name: system-prompts
description: Look up, quote, compare, and analyze leaked AI system prompts collected in this repo (Claude, ChatGPT/OpenAI, Gemini, Grok, Mistral, Copilot, Perplexity, and more).
when_to_use: When the user asks about the actual system prompt / instructions of a specific AI product or model (e.g. "what does ChatGPT's system prompt say about X", "show Claude Opus 4.8's prompt", "compare Gemini vs Grok instructions", "find every prompt that mentions tool use"). Use this instead of answering from memory — the repo holds the source-of-truth captured text.
---

# System Prompts lookup

This repository documents leaked/extracted **system prompts** for many AI
products. Prompts are plain `.md` (some `.json` for tool schemas), organized by
vendor folder at the repo root. Always read the file rather than recalling the
prompt from memory — versions change and the captured text is authoritative.

## Workflow

1. **Identify the target** — vendor + product/model + variant (e.g. "thinking",
   "instant", "api", "no-tools", "mobile"). Ask only if genuinely ambiguous.
2. **Locate the file**:
   - Browse the relevant vendor folder (see map below), or
   - `Glob` by pattern, e.g. `**/*gpt-5.5*`, `Anthropic/**/*opus*`, or
   - `Grep` across the repo for a phrase when you don't know the file, e.g.
     searching for a behavior like `"do not reveal"` across `*.md`.
3. **Read** the matched file(s) and answer from their contents. Quote exact
   lines when the user wants specifics; cite the path as `Folder/file.md`.
4. **Comparisons / "find all"**: fan out with `Grep` (use `output_mode:content`)
   or launch an `Explore` agent for broad sweeps, then synthesize.

## Repo map

- `Anthropic/` — Claude (`claude-fable-5.md`, `claude-opus-4.8.md`,
  `claude-opus-4.7.md`, `claude-sonnet-4.6.md`, integrations like
  `claude-cowork.md`, `claude-mobile-ios.md`, `claude-for-excel.md`).
  Subfolders: `Claude Code/` (CLI prompt, tools, `bundled-skills/`),
  `Official/` (release-date `claude_behavior`), `raw/`, `old/`.
- `OpenAI/` — ChatGPT & GPT models (`gpt-5.5-thinking.md`, `gpt-5.5-instant.md`,
  `gpt-5.5-api.md`, `chatgpt-atlas.md`, personality variants, voice modes).
  Subfolders: `API/`, `Codex/`, `Old/`.
- `Google/` — Gemini family, AI Studio, `gemini-cli.md`, `antigravity-cli.md`,
  Workspace, plus `*-tools.json` tool schemas.
- `xAI/` — Grok (`grok-4.3-beta.md`, `grok-expert.md`, `grok-personas.md`, api).
- `Microsoft/` — GitHub Copilot, `vscode-copilot-agent.md`, `copilot-cli.md`.
- `Meta/`, `Mistral/`, `Notion/`, `Perplexity/`, `Qwen/`, `Cursor/`.
- `Misc/` — everything else (Raycast, Warp, Zed, Devin, Brave, Kagi, Docker
  Gordon, ElevenLabs, Character.AI, etc.).

The root `README.md` has a maintained index table with direct links and a
"Recently Updated" section — consult it when you need the canonical link or the
newest addition.

## Notes

- File names encode the variant; prefer the most specific match to the user's
  ask (e.g. `claude-opus-4.6-no-tools.md` vs `claude-opus-4.6.md`).
- For "what changed between versions", diff two files (`git diff --no-index` or
  read both and compare the relevant sections).
- This is captured documentation, not executable software — there is nothing to
  build or run.
