import { useWorkspace } from "./Workspace";
import { usePanelViews } from "./hooks";
export function PanelTabsMenu() {
  const ws = useWorkspace();
  const tabs = usePanelViews();
  return (
    <select
      className="open-panel-tabs-menu"
      aria-label="Panel tabs"
      value=""
      onChange={(event) => ws.focus(event.target.value)}
    >
      <option value="" disabled>
        Tabs ({tabs.length})
      </option>
      {tabs.map((tab) => (
        <option key={tab.id} value={tab.id}>
          {tab.title}
          {tab.selected ? " ✓" : ""}
        </option>
      ))}
    </select>
  );
}
