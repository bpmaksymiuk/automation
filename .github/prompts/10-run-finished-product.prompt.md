# Run Finished Product

Use this prompt when the build is complete and you want to run or serve the finished product locally.

---

Run the finished product for <PROJECT_ROOT>.

Required inputs:
- `<PROJECT_ROOT>/10-RELEASE-NOTES.md`
- `<PROJECT_ROOT>/10-BUILD/README.md` if present
- `<PROJECT_ROOT>/10-BUILD/`
- `<PROJECT_ROOT>/deploy.sh` if you want the deploy path
- `<PROJECT_ROOT>/11-TESTS/playwright.smoke.config.mjs` if smoke testing is needed

Required actions:
1. Read `10-RELEASE-NOTES.md` and find the documented `Entry Point` and `Start Command`.
2. Prefer the documented start command. If none is documented, use the safest default:
   - static build: `python3 -m http.server 8090 --directory 10-BUILD`
   - Python app server: `python3 10-BUILD/agent.py --port 8077`
3. Start exactly one local run mode at a time.
4. Verify the product is reachable:
   - For static pages, open the local URL in a browser.
   - For live servers, run `curl` against the documented health or metrics endpoint.
5. If the run fails, report the exact missing file, command, or port conflict.
6. Do not change any project files unless a separate fix is explicitly requested.

Final response format:
- Run mode used.
- Command executed.
- URL or entry point.
- Verification result.
- Blockers, if any.
