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
