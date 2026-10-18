# open-panel-react

React components and hooks for Open-Panel. Requires React and React DOM 18.3+. The layout engine and stylesheet are included.

Install the package:

```sh
bun add open-panel-react
```

Declare view types and an initial layout:

```tsx
import { Workspace, ViewType, Split, Stage, View } from "open-panel-react";
import "open-panel-react/style.css";

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
  return <MyOverflowMenu compact={isCompact} />;
}
```

The hook updates when the panel resizes or its tabs change. `ViewType` also accepts
`fullWidth={true}` to make that tab fill available row space independently of the
workspace's automatic fill mode. Compact headers show only the
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

## Shared defaults and optional integrations

The core stylesheet now includes the playground's transparent gutters, borderless
panels, top highlights, subtle shadows, animated divider handles, and compact
headers. Scroll fades are enabled automatically (40px); use `scrollFade={false}`
or `scrollFade={{ size: 56 }}` on `Workspace`. Tab fill defaults to `"active"`.
Header mode remains `"separate"`; opt into `"overlay"` as shown above.

`PanelTabsMenu` is exported from `open-panel-react`. Use
`headerAction={<PanelTabsMenu />}` for a picker that stays visible when compact.

Optional entries keep third-party effects out of the base React bundle:

```tsx
import { GlassTabBackground } from "open-panel-react/glass"; // install @samasante/liquid-glass
import { useInteractionSounds } from "open-panel-react/sounds"; // install cuelume
```

`GlassTabBackground` accepts `theme` plus Glass props and goes in `tabBackground`.
`useInteractionSounds(workspace, { volume: 0.22, storageKey: "app:sounds" })`
returns `{ enabled, toggleSound }`. Its `defaultEnabled` option defaults to true.
Mount one sound controller per app because Cuelume's volume/enabled settings are
global. The sound hook removes its listeners and observers on unmount.

See the [complete guide and previews](https://github.com/emmanuel-defreitas/open-panel#readme).

## Tab context menus and scrollbars

`onTabContextMenu={({ event, view, panelId, tab }) => ...}` exposes tab gestures.
Return `false` to hand the bubbling event to a consumer's context-menu trigger;
call `event.preventDefault()` when opening your own menu directly. Keyboard menu
gestures follow the same path. See the [React + COSS integration example](https://github.com/emmanuel-defreitas/open-panel/blob/dev/docs/context-menu.md).

Content scrollbars use transparent tracks and subtle theme-aware thumbs. Override
`--open-panel-scrollbar-thumb` and `--open-panel-scrollbar-thumb-hover` through CSS
or `Workspace.tokens`. The native scrollbar keeps platform scrolling behavior and
uses system colors in forced-color mode.
