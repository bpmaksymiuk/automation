# Release Notes — [PROJECT NAME] v[VERSION]

- **STATUS:** PASS
- **STATUS UPDATED:** YYYY-MM-DD

---

## Build Summary

| Field | Value |
|-------|-------|
| Version | [e.g., 1.0.0] |
| Build Date | YYYY-MM-DD |
| Entry Point | [e.g., `10-BUILD/index.html` or `node 10-BUILD/server.js`] |
| Start Command | [e.g., `npx serve 10-BUILD/` or `node 10-BUILD/server.js`] |
| Runtime Dependencies | [e.g., Node 20+, none (static), Python 3.11+] |

---

## Implemented Features

<!-- One RN record per implemented DI. Include BR/UC-ID so the Tester can map coverage. -->

### RN-001 : [Feature Name]

- **DI REFERENCE:** DI-001
- **UC/BR COVERAGE:** UC-001, BR-001
- **DESCRIPTION:** [What was implemented — behavior not code]
- **ENTRY POINT / HOW TO VERIFY:** [The screen, URL path, or interaction that exercises this feature]

---

### RN-002 : [Feature Name]

- **DI REFERENCE:** DI-002
- **UC/BR COVERAGE:** UC-002, BR-002
- **DESCRIPTION:**
- **ENTRY POINT / HOW TO VERIFY:**

---

## Implementation Caveats

[Document every deviation from `7-DESIGN-INSTRUCTIONS.md`: simplifications, workarounds, unimplemented items. The Tester must not discover these by accident.]

| DI Reference | Deviation | Reason |
|--------------|-----------|--------|
| [DI-NNN]     | [What differs] | [Why] |

_None_ (if no deviations)

---

## Known Issues

[Bugs or limitations discovered during implementation. Include severity and workaround if available.]

| ID | Severity | Description | Workaround |
|----|----------|-------------|------------|
|    |          |             |            |

_None_ (if no known issues)

---

## Deployment Notes

[Anything Stage 12 needs to know: environment variables required, build steps, runtime dependencies, port bindings, static file server requirements.]

```
[Example: serve 10-BUILD/ on port 8080; no build step required]
```

---

GATE 10: PASS
