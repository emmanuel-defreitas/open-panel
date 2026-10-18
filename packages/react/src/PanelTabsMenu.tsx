import { useEffect, useRef, useState } from "react";
import { useView, useWorkspace } from "./Workspace";
import { usePanelViews } from "./hooks";

export function PanelTabsMenu() {
  const ws = useWorkspace();
  const { selected } = useView();
  const tabs = usePanelViews();
  const menuRef = useRef<HTMLSelectElement>(null);
  const [overflowIds, setOverflowIds] = useState<string[]>([]);
  const overflowTabs = tabs.filter((tab) => overflowIds.includes(tab.id));

  useEffect(() => {
    const menu = menuRef.current;
    const bar = menu?.closest('[data-open-panel-part="tabbar"]');
    const list = bar?.querySelector<HTMLElement>('[data-open-panel-part="tabs"]');
    if (!selected || !menu || !bar || !list) return;
    let frame = 0;
    let measuredScrollLeft = list.scrollLeft;
    let measuredScrollTop = list.scrollTop;
    const measure = () => {
      frame = 0;
      if (!list.clientWidth) return;
      const scrollLeft = list.scrollLeft;
      const scrollTop = list.scrollTop;
      // First check the space without the menu: its own width must not keep it
      // visible after a resize makes all tabs fit again.
      menu.hidden = true;
      const tabElements = Array.from(list.querySelectorAll<HTMLElement>('[data-open-panel-part="tab"]'));
      const isHidden = (tab: HTMLElement) => getComputedStyle(tab).display === "none";
      const overflowing =
        tabElements.some(isHidden) ||
        list.scrollWidth > list.clientWidth + 1 ||
        list.scrollHeight > list.clientHeight + 1;
      menu.hidden = !overflowing;
      list.scrollLeft = scrollLeft;
      list.scrollTop = scrollTop;
      measuredScrollLeft = list.scrollLeft;
      measuredScrollTop = list.scrollTop;
      const bounds = list.getBoundingClientRect();
      const hidden = overflowing
        ? tabElements
            .filter((tab) => {
              if (isHidden(tab)) return true;
              const rect = tab.getBoundingClientRect();
              return (
                rect.left < bounds.left - 1 ||
                rect.right > bounds.right + 1 ||
                rect.top < bounds.top - 1 ||
                rect.bottom > bounds.bottom + 1
              );
            })
            .map((tab) => tab.dataset.view!)
        : [];
      menu.hidden = hidden.length === 0;
      setOverflowIds((previous) =>
        previous.length === hidden.length && previous.every((id, index) => id === hidden[index])
          ? previous
          : hidden,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(bar);
    resize.observe(list);
    for (const tab of list.children) resize.observe(tab);
    const mutations = new MutationObserver(schedule);
    mutations.observe(list, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["hidden", "style", "class"],
    });
    mutations.observe(bar, { attributes: true, attributeFilter: ["data-header-compact"] });
    const onScroll = () => {
      if (list.scrollLeft !== measuredScrollLeft || list.scrollTop !== measuredScrollTop) schedule();
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      list.removeEventListener("scroll", onScroll);
    };
  }, [selected, tabs]);

  return (
    <select
      ref={menuRef}
      hidden={overflowTabs.length === 0}
      className="open-panel-tabs-menu"
      aria-label="Overflow tabs"
      value=""
      onChange={(event) => ws.focus(event.target.value)}
    >
      <option value="" disabled>
        Tabs ({overflowTabs.length})
      </option>
      {overflowTabs.map((tab) => (
        <option key={tab.id} value={tab.id}>
          {tab.title}
          {tab.selected ? " ✓" : ""}
        </option>
      ))}
    </select>
  );
}
