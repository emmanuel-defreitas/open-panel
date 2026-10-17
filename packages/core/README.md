# open-panel

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
