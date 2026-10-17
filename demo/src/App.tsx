import { useState } from "react";
import { Glass } from "@samasante/liquid-glass";
import {
  Panel,
  Split,
  Stage,
  View,
  ViewType,
  Workspace,
  WorkspaceProvider,
  useOptionalWorkspace,
  useView,
  useWorkspaceState,
  type Theme,
} from "open-panel-react";

const themes: Theme[] = ["light", "medium", "dark", "darker"];

// The icon slot keeps the decorative background attached to its tab.
function TabGlass() {
  const { selected } = useView();
  return (
    <Glass
      // className="tab-glass"
      aria-hidden="true"
      radius={8}

      //       optics={{
      //         frost: selected ? 0.5 : 0,
      //         brightness: selected ? 0.1 : 0,
      //
      //         strength: 0.8,
      //         dispersion: 0.8,
      //         sheen: 0.5,
      //       }}
      //   style={{ width: "100%", height: "100%" }}
    />
  );
}

export function App() {
  return (
    <WorkspaceProvider>
      <Demo />
    </WorkspaceProvider>
  );
}

function Demo() {
  const ws = useOptionalWorkspace();
  const snapshot = useWorkspaceState();
  const [theme, setTheme] = useState<Theme>("dark");
  const focused = snapshot.views.find((view) => view.id === snapshot.focusedView);
  const hidden = new Set(snapshot.hidden.map((panel) => panel.panelId));
  const panels = new Set(
    snapshot.views.filter((view) => !hidden.has(view.panelId)).map((view) => view.panelId),
  );

  function addPanel() {
    if (!ws) return;
    const titles = new Set(ws.views().map((view) => view.title));
    let number = 1;
    while (titles.has(`Panel ${number}`)) number++;
    ws.open("blank", { params: { name: `Panel ${number}` }, focus: true });
  }

  return (
    <div className="demo" data-theme={theme}>
      <header className="demo-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ▥
          </span>
          <strong>Open Panel</strong>
          <span className="subtitle">Layout playground</span>
        </div>
        <div className="controls" aria-label="Layout controls">
          <button onClick={addPanel} disabled={!ws}>
            + Add panel
          </button>
          <button onClick={() => ws?.navigation.toggle()} disabled={!focused && !snapshot.framed}>
            {snapshot.framed ? "Restore layout" : "Maximize"}
          </button>
          <button onClick={() => focused && ws?.toggleDock(focused.id)} disabled={!focused}>
            Float / dock
          </button>
          <button onClick={() => ws?.reset()} disabled={!ws}>
            Reset layout
          </button>
          <select
            aria-label="Color theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
          >
            {themes.map((value) => (
              <option key={value} value={value}>
                {value[0].toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </header>
      <div className="demo-guide">
        <span>Empty panels. Room to experiment.</span>
        <span>Drag tabs to move or split · Drag dividers to resize · Double-click a tab bar to maximize</span>
      </div>
      <main className="demo-main">
        <Workspace
          theme={theme}
          navigation="focus"
          floating="overlay"
          storageKey="open-panel-playground:layout"
          version={1}
          label="Panel playground"
          className="demo-workspace"
        >
          <ViewType<{ name: string }>
            id="blank"
            icon={<TabGlass />}
            title={(view) => view.params.name || "Panel"}
            placement="stage"
          >
            <div className="blank-panel" />
          </ViewType>
          <Split weights={[1, 2.5, 1]}>
            <Panel id="left">
              <View id="panel-1" type="blank" params={{ name: "Panel 1" }} />
              <View id="panel-2" type="blank" params={{ name: "Panel 2" }} />
            </Panel>
            <Split axis="y" weights={[2.5, 1]}>
              <Stage id="stage" empty={<div className="empty-stage">Drop a tab here or add a panel</div>}>
                <Panel>
                  <View id="panel-3" type="blank" params={{ name: "Panel 3" }} />
                  <View id="panel-4" type="blank" params={{ name: "Panel 4" }} />
                </Panel>
              </Stage>
              <Panel id="bottom">
                <View id="panel-5" type="blank" params={{ name: "Panel 5" }} />
              </Panel>
            </Split>
            <Split axis="y">
              <View id="panel-6" type="blank" params={{ name: "Panel 6" }} />
              <View id="panel-7" type="blank" params={{ name: "Panel 7" }} />
            </Split>
          </Split>
        </Workspace>
      </main>
      <footer className="demo-footer">
        <div className="panel-status">
          <span>{panels.size} panels</span>
          <span>{snapshot.document?.floating.length ?? 0} floating</span>
          <span>{focused ? `Selected: ${focused.title}` : "Select a panel to begin"}</span>
        </div>
        <div className="hidden-panels">
          {snapshot.hidden.map((panel) => (
            <button key={panel.panelId} onClick={() => ws?.restore(panel.panelId)}>
              Restore {panel.views.map((view) => view.title).join(" / ")}
            </button>
          ))}
        </div>
        <span>Layout saved automatically</span>
      </footer>
    </div>
  );
}
