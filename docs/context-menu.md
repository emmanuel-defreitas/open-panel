# Custom tab context menus

`Workspace.onTabContextMenu` is available in core and React. Custom-element users
can provide the same callback through the element's `.options` property.

```tsx
import type { TabContextMenuEvent } from "open-panel-react";

function onTabContextMenu({ event, view, panelId, tab }: TabContextMenuEvent) {
  // event.clientX / clientY are viewport coordinates.
  // view is the clicked view handle, including id, params, close(), and hide().
  // tab is the actual HTMLElement; panelId identifies its current group.
  event.preventDefault();
  showYourMenu({ x: event.clientX, y: event.clientY, view, panelId, anchor: tab });
}
```

Choose how to handle the gesture:

- Return `false` to suppress only Open Panel's built-in menu. The original event
  continues bubbling without being cancelled, so an ancestor context-menu trigger
  can handle it.
- Call `event.preventDefault()` to suppress both the browser menu and Open Panel's
  menu when you manage opening/positioning yourself.
- Return nothing without cancelling the event to observe the gesture and keep the
  built-in menu. Existing `renderMenu` still replaces the built-in menu renderer.

The clicked tab is selected/focused first. Header accessory controls keep their
own context menus. Shift+F10 and the Menu key dispatch a bubbling `contextmenu`
event positioned beneath the selected tab, so consumers receive keyboard gestures
through the same callback. That keyboard-generated mouse event is synthetic.
Handlers always receive current React props without remounting content.

## React + COSS UI

In an application already set up with COSS UI, add its context-menu component:

```sh
pnpm dlx shadcn@latest add @coss/context-menu
```

Use the [COSS trigger/popup composition](https://coss.com/ui/docs/components/context-menu).
Wrap the workspace in a non-interactive trigger; keep the menu controlled so
right-clicks on article content or header controls do not open the tab menu.
No COSS dependency is required by Open Panel itself.

```tsx
import { useRef, useState } from "react";
import { Workspace, ViewType, Panel, View, type TabContextMenuEvent } from "open-panel-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPopup,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import "open-panel-core/style.css";

export function NotesWorkspace() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<TabContextMenuEvent | null>(null);
  const gesture = useRef<TabContextMenuEvent | null>(null);

  return (
    <ContextMenu
      open={open}
      onOpenChange={(nextOpen) => {
        // The core callback runs before the event reaches the trigger.
        setOpen(nextOpen && gesture.current !== null);
      }}
    >
      <ContextMenuTrigger
        onContextMenuCapture={() => {
          gesture.current = null;
        }}
      >
        <Workspace
          style={{ height: "70vh" }}
          onTabContextMenu={(request) => {
            gesture.current = request;
            setTarget(request);
            return false; // Let COSS position and open the menu at the pointer.
          }}
        >
          <ViewType id="notes" title="Notes">
            <p>Your notes</p>
          </ViewType>
          <Panel>
            <View id="one" type="notes" />
            <View id="two" type="notes" />
          </Panel>
        </Workspace>
      </ContextMenuTrigger>
      <ContextMenuPopup>
        <ContextMenuItem disabled={!target} onClick={() => target?.view.hide()}>
          Hide panel
        </ContextMenuItem>
        <ContextMenuItem disabled={!target} onClick={() => void target?.view.close()}>
          Close tab
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  );
}
```

Keep the visible built-in panel menu (or provide an equivalent header action) so
these actions remain available without a context gesture. The capture handler
clears stale targets before each new event; the ref lets the opening decision see
the latest target synchronously, before React commits its state update.
