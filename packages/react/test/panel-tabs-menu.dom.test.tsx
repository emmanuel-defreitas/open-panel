import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { PanelTabsMenu } from "../src/PanelTabsMenu";

const { focus, tabs } = vi.hoisted(() => ({
  focus: vi.fn(),
  tabs: ["a", "b", "c"].map((id) => ({ id, title: id.toUpperCase(), selected: id === "a" })),
}));
vi.mock("../src/Workspace", () => ({
  useWorkspace: () => ({ focus }),
  useView: () => ({ selected: true }),
}));
vi.mock("../src/hooks", () => ({ usePanelViews: () => tabs }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it("lists only clipped tabs, tracks scroll, focuses selections, and disappears when all tabs fit", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  let resized = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resized = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const host = document.createElement("div");
  host.innerHTML =
    '<div data-open-panel-part="tabbar"><div data-open-panel-part="tabs"></div><span></span></div>';
  document.body.append(host);
  const list = host.querySelector<HTMLElement>('[data-open-panel-part="tabs"]')!;
  const slot = host.querySelector("span")!;
  let available = 400;
  const width = () => available - (slot.querySelector("select")?.hidden ? 0 : 100);
  Object.defineProperties(list, {
    clientWidth: { get: width },
    scrollWidth: { get: () => Math.max(300, width()) },
  });
  list.getBoundingClientRect = () => ({ left: 0, right: width(), top: 0, bottom: 30 }) as DOMRect;
  tabs.forEach((tab, index) => {
    const el = document.createElement("div");
    el.dataset.openPanelPart = "tab";
    el.dataset.view = tab.id;
    el.getBoundingClientRect = () =>
      ({
        left: index * 100 - list.scrollLeft,
        right: (index + 1) * 100 - list.scrollLeft,
        top: 0,
        bottom: 30,
      }) as DOMRect;
    list.append(el);
  });
  const flush = async () =>
    act(async () => {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(0));
    });
  const root = createRoot(slot);
  try {
    await act(async () => root.render(<PanelTabsMenu />));
    await flush();
    const menu = slot.querySelector("select")!;
    expect(menu.hidden).toBe(true);
    available = 250;
    resized();
    await flush();
    expect(menu.hidden).toBe(false);
    expect([...menu.options].map((option) => option.value)).toEqual(["", "b", "c"]);
    expect(menu.options[0].text).toBe("Tabs (2)");
    await act(async () => {
      menu.value = "c";
      menu.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(focus).toHaveBeenCalledWith("c");
    list.scrollLeft = 150;
    list.dispatchEvent(new Event("scroll"));
    await flush();
    expect([...menu.options].map((option) => option.value)).toEqual(["", "a", "b"]);
    available = 320; // Fits only once the menu's own footprint is removed.
    resized();
    await flush();
    expect(menu.hidden).toBe(true);
    expect(menu.options).toHaveLength(1);

    // Compact headers hide inactive tabs with CSS, without scroll overflow.
    available = 500;
    list.scrollLeft = 0;
    await act(async () => {
      (list.children[1] as HTMLElement).style.display = "none";
      (list.children[2] as HTMLElement).style.display = "none";
      list.parentElement!.setAttribute("data-header-compact", "");
    });
    await flush();
    expect(menu.hidden).toBe(false);
    expect([...menu.options].map((option) => option.value)).toEqual(["", "b", "c"]);
    expect(menu.options[0].text).toBe("Tabs (2)");
    await act(async () => {
      (list.children[1] as HTMLElement).style.display = "";
      (list.children[2] as HTMLElement).style.display = "";
      list.parentElement!.removeAttribute("data-header-compact");
    });
    await flush();
    expect(menu.hidden).toBe(true);
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
  expect(disconnect).toHaveBeenCalled();
  expect(frames.size).toBe(0);
});
