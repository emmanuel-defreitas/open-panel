import { useState } from "react";
import { Article } from "./Article";
import { useInteractionSounds } from "open-panel-react/sounds";
import { GlassTabBackground } from "open-panel-react/glass";
import {
  Panel,
  Split,
  Stage,
  View,
  ViewType,
  Workspace,
  WorkspaceProvider,
  useOptionalWorkspace,
  PanelTabsMenu,
  useFocusedView,
  useWorkspaceState,
  type Theme,
} from "open-panel-react";

const themes: Theme[] = ["light", "medium", "dark", "darker"];

export function App() {
  return (
    <WorkspaceProvider>
      <Demo />
    </WorkspaceProvider>
  );
}

function Demo() {
  const ws = useOptionalWorkspace();
  const sound = useInteractionSounds(ws, { storageKey: "open-panel-playground:sound" });
  const snapshot = useWorkspaceState();
  const [theme, setTheme] = useState<Theme>("dark");
  const [headerMode, setHeaderMode] = useState<"separate" | "overlay">("overlay");
  const focused = useFocusedView();
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
    <div className="demo" data-theme={theme} data-cuelume-emphasis="subtle">
      <header className="demo-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ▥
          </span>
          <strong>Open Panel</strong>
          <span className="subtitle">Layout playground</span>
          <a className="demo-docs-link" href="#docs">
            Docs ↗
          </a>
        </div>
        <div className="controls" aria-label="Layout controls">
          <select
            aria-label="Panel header mode"
            data-cuelume-select
            value={headerMode}
            onChange={(event) => setHeaderMode(event.target.value as "separate" | "overlay")}
          >
            <option value="overlay">Overlay header</option>
            <option value="separate">Separate header</option>
          </select>
          <button aria-pressed={sound.enabled} onClick={() => void sound.toggleSound()}>
            Sound {sound.enabled ? "on" : "off"}
          </button>
          <button onClick={addPanel} disabled={!ws}>
            + Add panel
          </button>
          <button
            data-cuelume-toggle
            onClick={() => ws?.navigation.toggle()}
            disabled={!focused && !snapshot.framed}
          >
            {snapshot.framed ? "Restore layout" : "Maximize"}
          </button>
          <button
            data-cuelume-toggle
            onClick={() => focused && ws?.toggleDock(focused.id)}
            disabled={!focused}
          >
            Float / dock
          </button>
          <button data-cuelume-tap onClick={() => ws?.reset()} disabled={!ws}>
            Reset layout
          </button>
          <select
            data-cuelume-select
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
        <span>Resize, rearrange, and scroll.</span>
        <span>Drag tabs to move or split · Drag dividers to resize · Double-click a tab bar to maximize</span>
      </div>
      <main className="demo-main">
        <Workspace
          theme={theme}
          headerMode={headerMode}
          tabs={{ fill: "active" }}
          navigation="focus"
          floating="overlay"
          storageKey="open-panel-playground:layout"
          version={1}
          label="Panel playground"
          className="demo-workspace"
        >
          <ViewType<{ name: string }>
            id="blank"
            tabBackground={<GlassTabBackground theme={theme} />}
            headerAction={<PanelTabsMenu />}
            title={(view) => view.params.name || "Panel"}
            placement="stage"
          >
            <Article />
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
