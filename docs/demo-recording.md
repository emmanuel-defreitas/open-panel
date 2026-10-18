# Record the README demo

The recording uses the actual playground: it focuses a panel, scrolls its content, floats and docks the view, and switches between dark and light themes. It starts in a fresh browser context and never reads your saved layout.

Required local tools: Node.js, `playwright-core` with a Chromium executable, and FFmpeg. The script does not install or download tools.

1. Run `bun run --cwd demo dev --host 127.0.0.1 --port 5314`.
2. Run `node demo/scripts/record-demo.mjs` with the environment variables below if needed.
3. Inspect `docs/assets/demo.gif` and `docs/assets/demo-static.png` before committing.

| Variable            | Default                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `DEMO_URL`          | `http://127.0.0.1:5314/`                                                |
| `PLAYWRIGHT_MODULE` | `playwright-core`; may be an absolute path to an existing module        |
| `CHROMIUM_PATH`     | Playwright's configured browser; may be an existing Chromium executable |

The script overwrites only its two generated assets. Existing banner and light-theme screenshots are preserved. It captures 76 frames at 8 fps (9.5 seconds), then exports a looping 800×500 GIF at 4 fps. The static PNG captures the first scene at 1120×700. The GIF uses a 128-color palette to keep the file small.

The README uses a static PNG fallback with alt text and dimensions. A `prefers-reduced-motion` source selects the static image where the renderer supports it. Check the committed README on GitHub; source selection can differ between renderers.
