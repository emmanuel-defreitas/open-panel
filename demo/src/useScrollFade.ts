import { useEffect, useRef } from "react";
import { useOptionalView } from "open-panel-react";

/** Fade only the edges with content remaining beyond the current scroll position. */
export function useScrollFade() {
  const contentRef = useRef<HTMLElement>(null);
  const view = useOptionalView();

  useEffect(() => {
    const content = contentRef.current;
    const scroller = view?.element;
    if (!content || !scroller) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const remaining = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;
      const overflows = scroller.scrollHeight > scroller.clientHeight + 1;
      const top = overflows && scroller.scrollTop > 1 ? Math.min(40, scroller.scrollTop) : 0;
      const bottom = overflows && remaining > 1 ? Math.min(40, remaining) : 0;
      scroller.style.setProperty("--scroll-fade-top", `${top}px`);
      scroller.style.setProperty("--scroll-fade-bottom", `${bottom}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    scroller.setAttribute("data-scroll-fade", "");
    scroller.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(scroller);
    observer.observe(content);
    content.addEventListener("load", schedule, true);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scroller.removeEventListener("scroll", schedule);
      content.removeEventListener("load", schedule, true);
      scroller.removeAttribute("data-scroll-fade");
      scroller.style.removeProperty("--scroll-fade-top");
      scroller.style.removeProperty("--scroll-fade-bottom");
    };
  }, [view]);

  return contentRef;
}
