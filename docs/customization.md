# Customize a workspace

Start the docs with `bun run dev`, then open **Customize**. Change a color in the editor and copy the generated CSS or React props. Use **Playground** for the full docking demo.

## Set colors in React

`tokens` sets CSS variables on the inner workspace root. Pass a built-in theme for the remaining defaults.

```tsx
<Workspace
  theme="dark"
  tokens={{
    "--open-panel-panel": "#1c2925",
    "--open-panel-text": "#edf3eb",
    "--open-panel-text-muted": "#a4b5a8",
    "--open-panel-accent": "#b5d3a3",
    "--open-panel-bg": "#111b17",
  }}
>
  {/* Your view types and layout */}
</Workspace>
```

## Use a stylesheet

Import `open-panel-react/style.css` before your overrides. In React, `className` belongs to the host element; target its `.open-panel` child for theme variables.

```tsx
<Workspace className="my-workspace" theme="dark">
  {/* Your view types and layout */}
</Workspace>
```

```css
.my-workspace {
  block-size: 70vh;
  min-block-size: 360px;
}

.my-workspace .open-panel {
  --open-panel-panel: oklch(0.26 0.025 160);
  --open-panel-text: oklch(0.94 0.01 160);
  --open-panel-text-muted: oklch(0.72 0.025 160);
  --open-panel-accent: oklch(0.8 0.08 140);
  --open-panel-bg: oklch(0.19 0.02 160);
  --open-panel-radius: 12px;
}
```

For the core runtime, apply variables directly to the `.open-panel` element it creates. Custom elements use light DOM, so their `.open-panel` child is also reachable from your stylesheet.

## Common variables

| Variable                                                              | Changes                                              |
| --------------------------------------------------------------------- | ---------------------------------------------------- |
| `--open-panel-panel`                                                  | Panel surface                                        |
| `--open-panel-bg` / `--open-panel-stage`                              | Workspace and stage backgrounds                      |
| `--open-panel-text` / `--open-panel-text-muted`                       | Primary and secondary text                           |
| `--open-panel-accent`                                                 | Focus rings, drop targets, and divider feedback      |
| `--open-panel-tab-inactive-bg`                                        | Inactive tab fill; derived from the panel by default |
| `--open-panel-scrollbar-thumb` / `--open-panel-scrollbar-thumb-hover` | Scrollbar colors                                     |
| `--open-panel-radius`                                                 | Panel corners                                        |
| `--open-panel-tabbar-height`                                          | Header height; default 48px                          |
| `--open-panel-resize-min-width` / `--open-panel-resize-min-height`    | Interactive resize minimums; defaults 232px / 310px  |

The built-in themes are `light`, `medium`, `dark`, `darker`, and `system`. Check text contrast and keep keyboard focus outlines visible when overriding colors.

## Style a part

Use `data-open-panel-part` selectors for local changes. Avoid changing the positioning or pointer behavior of tabs and resize handles: the runtime uses them as hit targets.

```css
.my-workspace [data-open-panel-part="content"] {
  line-height: 1.7;
}

.my-workspace .open-panel {
  --open-panel-tab-inactive-bg: oklch(0.28 0.01 260);
  --open-panel-scrollbar-thumb: oklch(0.6 0.02 260 / 35%);
  --open-panel-scrollbar-thumb-hover: oklch(0.7 0.02 260 / 55%);
}
```

Glass is optional. `GlassTabBackground` renders only for the selected tab; pass it the same theme as `Workspace`. See the [React reference](../packages/react/README.md) for slots and hooks.

## Publish on GitHub Pages

The included [workflow](../.github/workflows/pages.yml) builds the docs and playground from `dev`, with `/open-panel/` as the Vite base path. It uploads `demo/dist` as a Pages artifact and deploys it using GitHub Actions.

1. Set the repository's **Settings → Pages → Source** to **GitHub Actions**.
2. Allow the `dev` branch to deploy to the `github-pages` environment.
3. Merge the workflow into `dev`. Later pushes to `dev` update the site.

The repository currently uses a different default branch, so check the environment's allowed deployment branches. Change the workflow's base path if the repository is renamed. The build uses hash navigation, so the playground and docs links do not require a server rewrite.

See [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
