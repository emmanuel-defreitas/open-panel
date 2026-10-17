import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Panel,
  View,
  ViewType,
  Workspace,
  WorkspaceProvider,
  useViewState,
  usePanelViews,
  useFocusedView,
  useWorkspaceActions,
  useWorkspaceEvent,
  type WorkspaceHandle,
} from "../src";

describe("tab customization", () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    vi.unstubAllGlobals();
  });
  it("ships scroll fades by default and updates the option without remounting content", async () => {
    const render = (scrollFade?: boolean | { size: number }) => <Workspace scrollFade={scrollFade}>
      <ViewType id="notes" title="Notes"><textarea defaultValue="Keep this draft" /></ViewType>
      <View id="notes" type="notes" />
    </Workspace>;
    await act(async () => root.render(render()));
    const content = host.querySelector('[data-open-panel-part="content"]')!;
    const input = content.querySelector("textarea");
    expect(content.hasAttribute("data-scroll-fade")).toBe(true);
    expect(host.querySelector(".open-panel")?.getAttribute("data-tab-fill")).toBe("active");
    await act(async () => root.render(render(false)));
    expect(content.hasAttribute("data-scroll-fade")).toBe(false);
    expect(content.querySelector("textarea")).toBe(input);
    await act(async () => root.render(render({ size: 60 })));
    expect(content.hasAttribute("data-scroll-fade")).toBe(true);
    expect(content.querySelector("textarea")).toBe(input);
  });
  it("keeps header replacements and icons with their selected views", async () => {
    let ws: WorkspaceHandle | null = null;
    await act(async () =>
      root.render(
        <Workspace
          ref={(value) => {
            ws = value;
          }}
          tabs={{ fill: "active" }}
        >
          <ViewType
            id="custom"
            title="Custom"
            headerAction={<button>Custom action</button>}
            tabBackground={<span>Background</span>}
          />
          <ViewType id="plain" title="Plain" icon={null} />
          <Panel>
            <View id="custom" type="custom" />
            <View id="plain" type="plain" />
          </Panel>
        </Workspace>,
      ),
    );
    expect(host.querySelector(".open-panel")?.getAttribute("data-tab-fill")).toBe("active");
    expect(
      host.querySelector('[data-view="custom"][role="tab"] [data-open-panel-part="tab-prefix"] svg'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-view="plain"][role="tab"] [data-open-panel-part="tab-prefix"]'),
    ).toBeNull();
    const action = host.querySelector('[data-open-panel-part="header-action"]')!;
    expect(action.textContent).toBe("Custom action");
    expect(action.closest('[data-open-panel-part="accessory"]')?.hasAttribute("hidden")).toBe(false);
    await act(async () => ws!.select("plain"));
    expect(action.closest('[data-open-panel-part="accessory"]')?.hasAttribute("hidden")).toBe(true);
    await act(async () => ws!.select("custom"));
    expect(action.closest('[data-open-panel-part="accessory"]')?.hasAttribute("hidden")).toBe(false);
  });
  it("reads and controls views from outside the workspace and cleans up event listeners", async () => {
    let actions: ReturnType<typeof useWorkspaceActions> = null;
    let state: ReturnType<typeof useViewState> = null;
    let focused: ReturnType<typeof useFocusedView> = null;
    let tabs: ReturnType<typeof usePanelViews> = [];
    const events: string[] = [];
    const readState = (): ReturnType<typeof useViewState> => state;
    const readFocused = (): ReturnType<typeof useFocusedView> => focused;
    function Toolbar({ label }: { label: string }) {
      actions = useWorkspaceActions();
      state = useViewState("a");
      focused = useFocusedView();
      tabs = usePanelViews("group");
      useWorkspaceEvent("close", (view) => events.push(`${label}:${view.id}`));
      return null;
    }
    function Example({ label, show = true }: { label: string; show?: boolean }) {
      return (
        <WorkspaceProvider>
          {show && <Toolbar label={label} />}
          <Workspace>
            <ViewType id="blank" title="Blank" />
            <Panel id="group">
              <View id="a" type="blank" />
              <View id="b" type="blank" />
            </Panel>
          </Workspace>
        </WorkspaceProvider>
      );
    }
    await act(async () => root.render(<Example label="old" />));
    expect(readState()?.panelId).toBe("group");
    expect(tabs.map((tab) => tab.id)).toEqual(["a", "b"]);
    const originalActions = actions;
    await act(async () => actions!.focus("b"));
    expect(readFocused()?.id).toBe("b");
    expect(readState()?.selected).toBe(false);
    expect(actions).toBe(originalActions);
    await act(async () => root.render(<Example label="latest" />));
    await act(async () => {
      await actions!.close("a");
    });
    expect(state).toBeNull();
    expect(tabs.map((tab) => tab.id)).toEqual(["b"]);
    expect(events).toEqual(["latest:a"]);
    await act(async () => root.render(<Example label="latest" show={false} />));
    await act(async () => {
      await actions!.close("b");
    });
    expect(events).toEqual(["latest:a"]);
  });
  it("switches visible grouped headers between separate and overlay without replacing content", async () => {
    function Example({ mode }: { mode: "separate" | "overlay" }) {
      return (
        <Workspace headerMode={mode}>
          <ViewType id="article" title="Article">
            <p>Reading content</p>
          </ViewType>
          <Panel>
            <View id="a" type="article" />
            <View id="b" type="article" />
          </Panel>
        </Workspace>
      );
    }
    await act(async () => root.render(<Example mode="separate" />));
    const content = host.querySelector('[data-open-panel-content="a"]');
    const bar = host.querySelector('[data-open-panel-part="tabbar"]')!;
    expect(bar.hasAttribute("data-overlay")).toBe(false);
    await act(async () => root.render(<Example mode="overlay" />));
    expect(bar.hasAttribute("data-overlay")).toBe(true);
    expect(bar.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(host.querySelector('[data-open-panel-content="a"]')).toBe(content);
    await act(async () => root.render(<Example mode="separate" />));
    expect(bar.hasAttribute("data-overlay")).toBe(false);
    expect(bar.parentElement?.getAttribute("data-open-panel-part")).toBe("panel");
    expect(host.querySelector('[data-open-panel-content="a"]')).toBe(content);
  });
});
