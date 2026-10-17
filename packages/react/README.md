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
