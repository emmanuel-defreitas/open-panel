# open-panel-core

The framework-agnostic core of Open-Panel: dockable, zoomable workspaces for web tools.

Install it:

```sh
bun install open-panel-core
```

Create a workspace in an element:

```ts
import { createWorkspace, layout as L } from "open-panel-core";
import "open-panel-core/style.css";

const ws = createWorkspace(element, {
  types: { notes: { title: "Notes", mount: (el) => void (el.innerHTML = "<textarea></textarea>") } },
  defaultLayout: L.row([L.view("notes"), L.stage()], [1, 3]),
});
```

Set minimum visible panel dimensions for interactive resizing using pixel-valued
CSS tokens on `.open-panel`:

```css
.open-panel {
  --open-panel-resize-min-width: 120px;
  --open-panel-resize-min-height: 100px;
}
```

These constrain pointer and keyboard divider resizing and floating-window resize
handles. They are independent of a view's `minSize`, which controls content scaling.
Navigation zoom and layouts with insufficient available space can still display
smaller panels.

If the two sides of a divider cannot fit their combined minimums, resizing uses
proportional compact limits instead of locking the divider at the midpoint. The
configured minimums apply again once enough space is available.

## Shared presentation defaults

Import `open-panel-core/style.css` once. It includes transparent workspace/stage
backgrounds, borderless panels (neutral-50 in light mode), top highlights, subtle
resting shadows, drag shadows, and divider handles visible on hover/focus/resize.
The header is 48px high; interactive resize minimums are 232 × 310px. Override
these through `tokens` or CSS custom properties.

`tabs.fill` defaults to `"active"`; compact headers show only the selected tab.
`headerMode` defaults to `"separate"`. Set `"overlay"` to scroll beneath the header.
Use `--open-panel-titlebar-height` as initial content padding in overlay mode.

`scrollFade` defaults to true with 40px edges. Pass false to disable it or
`{ size: 56 }` to change its length. Fades update on scrolling, resizing, child
changes, and image loads. They disappear at reached edges and for short content.
`attachScrollFade(element, options)` exports the same observer lifecycle for a
custom scroller and returns a cleanup function. The shared mask styling targets
`[data-open-panel-part="content"][data-scroll-fade]` inside `.open-panel`.

Optional React glass/sound components are adapter features, not core dependencies.
See the [full guide](https://github.com/emmanuel-defreitas/open-panel#readme).

## Tab context menus and scrollbars

`onTabContextMenu={({ event, view, panelId, tab }) => ...}` exposes tab gestures.
Return `false` to hand the bubbling event to a consumer's context-menu trigger;
call `event.preventDefault()` when opening your own menu directly. Keyboard menu
gestures follow the same path. See the [React + COSS integration example](https://github.com/emmanuel-defreitas/open-panel/blob/dev/docs/context-menu.md).

Content scrollbars use transparent tracks and subtle theme-aware thumbs. Override
`--open-panel-scrollbar-thumb` and `--open-panel-scrollbar-thumb-hover` through CSS
or `Workspace.tokens`. The native scrollbar keeps platform scrolling behavior and
uses system colors in forced-color mode.
