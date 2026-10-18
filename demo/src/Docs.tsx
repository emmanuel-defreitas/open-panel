import { useState } from "react";
import { Panel, PanelTabsMenu, View, ViewType, Workspace } from "open-panel-react";
import "./docs.css";

const presets = {
  Ink: { panel: "#1a1b1f", text: "#e7e8eb", muted: "#9699a3", accent: "#a7b9f2", bg: "#101114" },
  Paper: { panel: "#fafafa", text: "#262931", muted: "#616774", accent: "#4267b2", bg: "#eeeff2" },
  Moss: { panel: "#1c2925", text: "#edf3eb", muted: "#a4b5a8", accent: "#b5d3a3", bg: "#111b17" },
};
const variables = [
  ["--open-panel-panel", "Panel surface"],
  ["--open-panel-text", "Content and active tab text"],
  ["--open-panel-text-muted", "Inactive labels and secondary text"],
  ["--open-panel-accent", "Focus rings, drop targets, and dividers"],
  ["--open-panel-bg", "Workspace background between panels"],
  ["--open-panel-tab-inactive-bg", "Inactive tab fill; derived from the panel by default"],
  ["--open-panel-scrollbar-thumb", "Content scrollbar thumb"],
  ["--open-panel-scrollbar-thumb-hover", "Scrollbar thumb on hover"],
  ["--open-panel-radius", "Panel corner radius"],
  ["--open-panel-tabbar-height", "Header height (48px by default)"],
  ["--open-panel-resize-min-width", "Interactive resize minimum (232px by default)"],
  ["--open-panel-resize-min-height", "Interactive resize minimum (310px by default)"],
];

function Code({ label, children }: { label: string; children: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setStatus("Copied");
    } catch {
      setStatus("Select and copy the code below");
    }
  }
  return (
    <div className="docs-code">
      <div className="docs-code-bar">
        <span>{label}</span>
        <button onClick={copy} aria-label={`Copy ${label}`}>
          Copy
        </button>
      </div>
      <pre tabIndex={0}>
        <code>{children}</code>
      </pre>
      <span className="docs-copy-status" role="status">
        {status}
      </span>
    </div>
  );
}

export function Docs() {
  const [colors, setColors] = useState(presets.Ink);
  const [preset, setPreset] = useState("Ink");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [radius, setRadius] = useState(10);
  const [header, setHeader] = useState<"overlay" | "separate">("separate");
  const tokens = {
    "--open-panel-panel": colors.panel,
    "--open-panel-text": colors.text,
    "--open-panel-text-muted": colors.muted,
    "--open-panel-accent": colors.accent,
    "--open-panel-bg": colors.bg,
    "--open-panel-radius": `${radius}px`,
  };
  const css = `.my-workspace {\n  block-size: 70vh;\n  min-block-size: 360px;\n}\n\n.my-workspace .open-panel {\n${Object.entries(
    tokens,
  )
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")}\n}`;
  const react = `<Workspace\n  className="my-workspace"\n  theme="${theme}"\n  headerMode="${header}"\n  tokens={${JSON.stringify(tokens, null, 4).replace(/\n/g, "\n  ")}}\n>\n  {/* Register ViewType components and your layout here. */}\n</Workspace>`;
  return (
    <div className="docs-page">
      <a className="docs-skip" href="#docs-main">
        Skip to content
      </a>
      <header className="docs-header">
        <a className="docs-brand" href="#docs">
          <span aria-hidden="true">▥</span> Open Panel <small> / docs</small>
        </a>
        <nav aria-label="Documentation">
          <a href="#customize">Customize</a>
          <a href="#reference">Variables</a>
          <a href="#playground">Playground ↗</a>
          <a href="https://github.com/emmanuel-defreitas/open-panel">GitHub ↗</a>
        </nav>
      </header>
      <main id="docs-main">
        <section className="docs-hero">
          <p className="docs-eyebrow">Documentation</p>
          <h1>Open Panel</h1>
          <p className="docs-lede">
            Dockable panels for React, web components, and TypeScript. Try the layout, then copy the code you
            need.
          </p>
          <div className="docs-actions">
            <a className="docs-primary" href="#playground">
              Open playground <span aria-hidden="true">↗</span>
            </a>
            <a href="#start">Install & setup</a>
          </div>
          <p className="docs-compat">
            <span>v0.1.x · React 18.3+</span>
          </p>
        </section>
        <section id="customize" className="docs-section">
          <div className="docs-section-heading">
            <h2>Customize colors</h2>
            <p>Choose a preset or edit a color. Copy the generated CSS or React props below the preview.</p>
          </div>
          <div className="docs-customizer">
            <div className="docs-editor">
              <fieldset className="docs-presets">
                <legend>Starting palette</legend>
                {Object.entries(presets).map(([name, value]) => (
                  <button
                    key={name}
                    aria-pressed={preset === name}
                    onClick={() => {
                      setPreset(name);
                      setTheme(name === "Paper" ? "light" : "dark");
                      setColors(value);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </fieldset>
              <div className="docs-color-grid">
                {(
                  [
                    ["panel", "Panel surface"],
                    ["text", "Text"],
                    ["muted", "Muted text"],
                    ["accent", "Accent"],
                    ["bg", "Workspace"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    <span>{label}</span>
                    <span className="docs-color-value">
                      <code>{colors[key]}</code>
                      <input
                        aria-label={label}
                        type="color"
                        value={colors[key]}
                        onChange={(event) => {
                          setPreset("Custom");
                          setColors({ ...colors, [key]: event.target.value });
                        }}
                      />
                    </span>
                  </label>
                ))}
              </div>
              <label className="docs-range">
                Corner radius <output>{radius}px</output>
                <input
                  aria-label="Corner radius"
                  type="range"
                  min="0"
                  max="24"
                  value={radius}
                  onChange={(event) => setRadius(Number(event.target.value))}
                />
              </label>
              <label className="docs-select">
                Header placement
                <select value={header} onChange={(event) => setHeader(event.target.value as typeof header)}>
                  <option value="separate">Separate</option>
                  <option value="overlay">Overlay</option>
                </select>
              </label>
            </div>
            <div className="docs-preview">
              <div className="docs-preview-label">
                <span>Live workspace</span>
                <span>Switch tabs to try the theme</span>
              </div>
              <Workspace
                className="docs-workspace"
                theme={theme}
                tokens={tokens}
                headerMode={header}
                label="Customization preview"
                scrollFade={{ size: 32 }}
              >
                <ViewType id="notes" title="Notes" headerAction={<PanelTabsMenu />}>
                  <article className="docs-sample">
                    <small>EXAMPLE CONTENT</small>
                    <h3>Notes</h3>
                    <p>
                      This is a regular React component inside a panel. Replace it with your editor, chart, or
                      document.
                    </p>
                    <p>
                      Switch between Notes, Draft, and Outline. When the tab row is too narrow, the other tabs
                      move into a dropdown.
                    </p>
                    <p>
                      Color changes apply immediately. Use the controls beside this preview to change the
                      panel surface, text, and focus color.
                    </p>
                  </article>
                </ViewType>
                <ViewType id="outline" title="Outline">
                  <article className="docs-sample">
                    <small>TRY IT</small>
                    <h3>Panel controls</h3>
                    <ol>
                      <li>Drag a tab to another panel</li>
                      <li>Drag a divider to resize</li>
                      <li>Double-click a tab bar to maximize</li>
                    </ol>
                    <p>Use the same tokens in React, custom elements, or the core TypeScript runtime.</p>
                  </article>
                </ViewType>
                <Panel>
                  <View id="preview-notes" type="notes" />
                  <View id="preview-draft" type="notes" title="Draft" />
                  <View id="preview-outline" type="outline" />
                </Panel>
              </Workspace>
            </div>
          </div>
          <div className="docs-code-grid">
            <Code label="CSS · load after the package stylesheet">{css}</Code>
            <Code label="React · Workspace.tokens">{react}</Code>
          </div>
          <p className="docs-note">
            The examples above stay in sync with your choices. Use CSS for a shared theme, or{" "}
            <code>tokens</code> for one React workspace. The package uses low-specificity selectors so your
            class can override its defaults. In React, className is on the host; target its .open-panel child
            for CSS variables.
          </p>
        </section>
        <section id="start" className="docs-section docs-start">
          <div>
            <h2>Install & setup</h2>
            <p>
              Inside an existing React 18.3+ app with a bundler, install the core and React packages. Import
              the CSS once and give the workspace a height.
            </p>
            <p>
              Working from source? Run <code>bun install</code>, then <code>bun run dev</code>. This demo
              resolves the local packages.
            </p>
          </div>
          <div>
            <Code label="Install">{"npm install open-panel-core open-panel-react"}</Code>
            <Code label="App.tsx">{`import { Workspace, ViewType, Split, View } from "open-panel-react";
import "open-panel-core/style.css";

export default function App() {
  return (
    <Workspace theme="dark" style={{ height: "70vh" }}>
      <ViewType id="notes" title="Notes">
        <p>Your content goes here.</p>
      </ViewType>
      <Split>
        <View type="notes" />
        <View type="notes" />
      </Split>
    </Workspace>
  );
}`}</Code>
          </div>
        </section>
        <section id="reference" className="docs-section">
          <h2>CSS variables</h2>
          <p>
            Set these on your workspace element. Built-in themes: <code>light</code>, <code>medium</code>,{" "}
            <code>dark</code>, <code>darker</code>, and <code>system</code>.
          </p>
          <div className="docs-table-wrap">
            <table>
              <caption>Common customization variables</caption>
              <thead>
                <tr>
                  <th scope="col">CSS variable</th>
                  <th scope="col">What it changes</th>
                </tr>
              </thead>
              <tbody>
                {variables.map(([token, description]) => (
                  <tr key={token}>
                    <th scope="row">
                      <code>{token}</code>
                    </th>
                    <td>{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="docs-code-grid">
            <Code label="CSS · tabs and scrollbars">{`.my-workspace .open-panel {
  --open-panel-tab-inactive-bg: oklch(0.28 0.01 260);
  --open-panel-scrollbar-thumb: oklch(0.6 0.02 260 / 35%);
  --open-panel-scrollbar-thumb-hover: oklch(0.7 0.02 260 / 55%);
}

.my-workspace [data-open-panel-part="content"] {
  line-height: 1.7;
}`}</Code>
            <Code label="React · optional active-tab glass">{`import { PanelTabsMenu, ViewType } from "open-panel-react";
import { GlassTabBackground } from "open-panel-react/glass";
// Install @samasante/liquid-glass separately.

<ViewType
  id="notes"
  title="Notes"
  tabBackground={<GlassTabBackground theme="dark" />}
  headerAction={<PanelTabsMenu />}
>
  <YourContent />
</ViewType>`}</Code>
          </div>
          <p className="docs-note">
            Keep the workspace and glass themes in sync. Glass is applied to the selected tab; inactive tabs
            use a solid fill. The overflow menu lists only tabs that are clipped or hidden by compact mode.
            Preserve focus outlines and check text contrast when changing colors.
          </p>
        </section>
        <section className="docs-section docs-further">
          <h2>API reference</h2>
          <a href="https://github.com/emmanuel-defreitas/open-panel/tree/dev/packages/react">React API ↗</a>
          <a href="https://github.com/emmanuel-defreitas/open-panel/tree/dev/packages/core">
            Core TypeScript ↗
          </a>
          <a href="https://github.com/emmanuel-defreitas/open-panel/tree/dev/packages/element">
            Web components ↗
          </a>
          <a href="https://github.com/emmanuel-defreitas/open-panel/blob/dev/docs/context-menu.md">
            Context menus ↗
          </a>
        </section>
      </main>
      <footer className="docs-footer">
        Open Panel <span>Docs and examples</span>
        <a href="#docs-main">Back to top ↑</a>
      </footer>
    </div>
  );
}
