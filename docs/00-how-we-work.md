# 00 — How We Work (read this first)

> One line: **Claude (in chat) designs and builds each feature on its own branch and opens a Pull Request that explains it step by step. You run it, read it with Claude Code, review it with Codex, then merge it yourself.**

## 1. Who does what

| Who | Where | Job |
|---|---|---|
| **Claude (chat)** | Claude app, cloud workspace | Architect and builder. Writes the code, the tests and a step-by-step explanation for each feature. Pushes a `feat/...` branch and opens a PR |
| **You** | VS Code on Zorin OS | Run the app, read the code and the explanation, review the PR, **merge**, write your notes |
| **Claude Code** (VS Code) | Your laptop | Your **tutor**. Explains files and answers "why" |
| **Codex** (VS Code) | Your laptop | Your **reviewer**. Reviews each PR diff for bugs, security problems and missing tests |

Using two different AIs for *tutor* and *reviewer* is on purpose: a reviewer that didn't write the code catches different mistakes.

## 2. The loop for every feature

| Step | Who | Time | What happens |
|---|---|---|---|
| 1. Brief | Claude | — | Chat message: what the feature does, the design, and what you'll learn |
| 2. Build | Claude | — | Branch `feat/NN-name`, code + tests, CI green, PR opened with the full explanation |
| 3. Run it | You | 30 min | `git fetch && git switch feat/NN-name`, `docker compose up -d`, `pnpm dev`, click through it |
| 4. Read it | You + Claude Code | 1.5–2 h | Read the PR explanation, then the files in the **"Read in this order"** list. Ask Claude Code about anything unclear |
| 5. Review it | You + Codex | 30 min | Ask Codex to review the diff. Paste anything real into our chat; Claude fixes it or explains why not |
| 6. Merge + notes | You | 30 min | Squash-merge the PR on GitHub, `git switch main && git pull`, write `docs/learning/NN.md` in your own words |

## 3. Git rules (so we never overwrite each other)

1. **Claude only pushes to `feat/...` branches.** Never to `main`.
2. **You are the only one who merges into `main`.** That makes you the owner of the project's history.
3. Before Claude starts the next feature, it pulls `main`, so your notes are included.
4. Don't edit code on a `feat/...` branch locally; ask Claude in chat to change it instead.
5. Never commit `.env`. Only `.env.example` (no real secrets) goes in Git.

## 4. Prompts to paste into VS Code

### Claude Code (tutor) — use Ask/Plan mode so it doesn't edit files

```
I'm learning. Explain apps/api/src/<file>.ts to me step by step:
what each part does, why it's written this way, and what would break
if we removed it. Don't change any files.
```

### Codex (reviewer) — read-only review

```
Review the changes on this branch compared to main (git diff main...HEAD).
Look for: bugs, security problems (auth, tenant isolation, injection, secrets),
missing tests, and anything that doesn't match docs/03-database-design.md.
Do not modify files. List findings by severity with file and line.
```

## 5. When something breaks on your laptop

Paste into our chat: the **exact command**, the **full error output**, and the output of `git status`. Don't let Claude Code "fix" the error locally on a `feat/...` branch; that causes conflicts. Claude fixes it on the branch and pushes again.

## 6. Being honest about AI in interviews

Every commit from the chat says `Co-Authored-By: Claude`. That's fine and it's honest. In interviews, say: *"I designed the system with an AI architect, built it with AI agents, reviewed every PR myself, and here's why we chose X."* Then prove it by explaining the code. That combination is exactly what 2026 job posts are asking for.
