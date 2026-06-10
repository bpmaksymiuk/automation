# GitHub Copilot Workspace Instructions

This repository is a software factory pipeline. The pipeline instruction file is the single source of truth for all stage governance, agent ownership rules, quality gates, and execution behaviour. See `.github/instructions/pipeline.instructions.md`.

Do not restate, fork, or override pipeline policy in this file. This file is the entry point only.

## Default Operating Order

For product work under `PROJECTS/<APP>/`:
1. Read `.github/instructions/pipeline.instructions.md` first.
2. Change into `PROJECTS/<APP>/` and treat it as the active project root.
3. Load the stage-appropriate skill from `.github/skills/`.
4. Follow the agent and ownership rules in `.github/agents/`.

## Source Of Truth Rule

Do not restate, fork, or override pipeline policy here. Stage order, ownership, artifact mapping, quality gates, and recovery behaviour belong in `.github/instructions/pipeline.instructions.md`.

## Agents

- [Writer](.github/agents/writer.agent.md) — Stage 1: open-ended brainstorm of user idea
- [User/BA](.github/agents/user-ba.agent.md) — Stage 2 advisory: contribute to use-case discovery and scope framing
- [Product Owner](.github/agents/product-owner.agent.md) — Stage 2: approve use cases as single source of intent
- [Writer](.github/agents/writer.agent.md) — Stages 3 & 8: narrative vision and all text content
- [Graphic Artist](.github/agents/graphic-artist.agent.md) — Stages 4 & 9: concept storyboards and final graphic assets
- [Business Analyst](.github/agents/business-analyst.agent.md) — Stage 5: atomic, testable business requirements
- [Architect](.github/agents/architect.agent.md) — Stage 6: architecture decisions and parts inventory
- [Technical Lead](.github/agents/technical-lead.agent.md) — Stage 7: implementation-ready design instructions
- [Developer](.github/agents/developer.agent.md) — Stage 10: implement design instructions and write release notes
- [Tester](.github/agents/tester.agent.md) — Stage 11: write test cases, verify product, issue release recommendation
- [Prod Ops](.github/agents/prod-ops.agent.md) — Stage 12: deploy to production, run smoke tests, write deployment results
- [Manager](.github/agents/manager.agent.md) — cross-cutting: gate failure detection, routing, and recovery
- [Auditor](.github/agents/auditor.agent.md) — cross-cutting: compliance observation after every stage

## Skills

| Skill | File | Used At |
|-------|------|---------|
| Brainstorming | `.github/skills/brainstorming-authoring/SKILL.md` | Stage 1 |
| Use Case Authoring | `.github/skills/use-case-authoring/SKILL.md` | Stage 2 |
| Content Writing | `.github/skills/content-writing-authoring/SKILL.md` | Stages 3, 8 |
| Concept Storyboard | `.github/skills/concept-storyboard-authoring/SKILL.md` | Stage 4 |
| Business Requirements | `.github/skills/business-requirements-writing/SKILL.md` | Stage 5 |
| Architecture & Parts | `.github/skills/architecture-and-parts-authoring/SKILL.md` | Stage 6 |
| Design Instructions | `.github/skills/design-instructions-authoring/SKILL.md` | Stage 7 |
| Graphic Artwork | `.github/skills/graphic-artwork-authoring/SKILL.md` | Stage 9 |
| Implementation | `.github/skills/implementation-stage/SKILL.md` | Stage 10 |
| Release Notes | `.github/skills/release-notes-writing/SKILL.md` | Stage 10 |
| Test Case Authoring | `.github/skills/test-case-authoring/SKILL.md` | Stage 11 |
| Test Report Writing | `.github/skills/test-report-writing/SKILL.md` | Stage 11 |
| Bug Report Writing | `.github/skills/bug-report-writing/SKILL.md` | Stage 11 |
| Browser Remote Control | `.github/skills/browser-remote-control/SKILL.md` | Cross-cutting |
| Manager Orchestration | `.github/skills/manager-pipeline-orchestration/SKILL.md` | Cross-cutting |
| Auditor | `.github/skills/auditor/SKILL.md` | Cross-cutting |
| Prod Ops | `.github/skills/prod-ops/SKILL.md` | Stage 12 |

## General Expectations

1. Prefer minimal, stage-correct changes over broad rewrites.
2. Keep paths repository-relative from the active project folder.
3. Preserve existing project structure unless the active stage artifact requires a change.
4. For implementation changes, update `10-RELEASE-NOTES.md` and preserve append-only verification history.
