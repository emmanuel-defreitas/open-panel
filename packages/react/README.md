# open-panel-react

React components and hooks for Open-Panel. Requires React 18.3+ and `open-panel`.

Install it with the core package:

```sh
bun install open-panel-react open-panel-core
```

Declare view types and an initial layout:

```tsx
import { Workspace, ViewType, Split, Stage, View } from "open-panel-react";
import "open-panel-core/style.css";

<Workspace theme="dark">
  <ViewType id="notes" title="Notes">
    <Notes />
  </ViewType>
  <Split weights={[1, 3]}>
    <View type="notes" />
    <Stage />
  </Split>
</Workspace>;
```

Customize tab headers with a prefix icon, a decorative background, and a trailing
control. The selected view supplies its panel's `headerAction`:

```tsx
<Workspace tabs={{ fill: "active" }}>
  <ViewType
    id="notes"
    title="Notes"
    icon={<NotesIcon />}
    headerAction={(view) => <button onClick={() => view.hide()}>Hide</button>}
  >
    <Notes />
  </ViewType>
  <Stage>
    <View type="notes" />
  </Stage>
</Workspace>
```

- `icon` defaults to a single-tab symbol. Supply any React node, or `null`/`false`
  to omit it.
- `headerAction` accepts any React node or a render function receiving the view.
  Omit it to keep the built-in panel menu; use `null` to leave that space empty.
  Custom controls inherit the view/workspace hooks and follow the view when moved.
  The existing `accessory` slot remains available alongside the replacement.
- `tabBackground` adds a decorative layer independent of the prefix icon.
- `tabs={{ fill: "active" }}` lets the selected tab fill remaining space beside
  the other tabs and header controls only when their natural widths come within
  12px of filling the available tab row. Roomy rows keep natural tab widths. `fill: true` gives all tabs equal space.

Use `useIsCompact()` inside a view, tab decoration, or header action to respond to
crowded headers and small panels:

```tsx
function HeaderAction() {
  const isCompact = useIsCompact();
  return isCompact ? null : <MyOverflowMenu />;
}
```

The hook updates when the panel resizes or its tabs change. `ViewType` also accepts
`fullWidth={true}` to make that tab fill available row space independently of the
workspace's automatic fill mode. In the demo, compact headers show only the
selected tab at full width; arrow keys still select the other tabs.

For UI outside the panel content, wrap the workspace and its toolbar/sidebar in
`WorkspaceProvider`. These hooks can then read and control the same instance:

| Hook                                | Purpose                                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `useViewState(viewId?)`             | Subscribe to a view's presentation state by ID, or the enclosing view. Returns `null` before mounting or after closing.    |
| `usePanelViews(panelId?)`           | Read the panel's tabs in layout order; defaults to the enclosing view's panel.                                             |
| `useFocusedView()`                  | Read the focused view, or `null`.                                                                                          |
| `useWorkspaceActions()`             | Stable open, close, focus, select, hide, restore, float, dock, reset, layout, and navigation controls; `null` until ready. |
| `useWorkspaceEvent(event, handler)` | Subscribe to events with the latest handler and automatic cleanup.                                                         |

```tsx
function Toolbar() {
  const actions = useWorkspaceActions();
  const focused = useFocusedView();
  useWorkspaceEvent("close", (view) => console.log("Closed", view.id));
  return (
    <button disabled={!actions || !focused} onClick={() => focused && actions?.hide(focused.id)}>
      Hide {focused?.title ?? "panel"}
    </button>
  );
}
```

Use the existing `useWorkspaceSelector` for derived workspace state with a custom
equality check, `useWorkspaceState` for the complete snapshot, and
`useOptionalWorkspace`/`useWorkspace` for direct access to the full imperative API.
Hooks are scoped to their nearest workspace/provider; they do not introduce global
state shared between unrelated workspaces.

Set `headerMode="overlay"` on `Workspace` to keep visible panel headers fixed
above content that scrolls behind them, including multi-tab panels. The default
`"separate"` reserves space above the scrollable content. This option can change
at runtime without remounting view content; tab dragging, panel dragging, and
header controls retain their existing handlers. Explicit `tabbar="never"` and
single-view `tabbar="auto"` rules still hide their headers.

Use the inherited content token to give your article an initial top inset:

```css
.article {
  padding-top: calc(var(--open-panel-titlebar-height, 0px) + 24px);
}
```

The inset scrolls away with the content; the header stays in place. The existing
per-type `tabbar="overlay"` behavior remains available for custom single-view
headers independently of this workspace option.
