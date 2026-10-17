/** Edge length in CSS pixels; edges disappear when there is nothing left to scroll. */
export interface ScrollFadeOptions {
  size?: number;
}

/** Attach fades to an existing scroll container. Returns an idempotent cleanup. */
export function attachScrollFade(scroller: HTMLElement, { size = 40 }: ScrollFadeOptions = {}): () => void {
  const length = Number.isFinite(size) ? Math.max(0, size) : 40;
  let frame = 0;
  let disposed = false;
  const update = () => {
    frame = 0;
    if (disposed) return;
    const remaining = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;
    const overflows = scroller.scrollHeight > scroller.clientHeight + 1;
    const extent = Math.min(length, scroller.clientHeight / 2);
    scroller.style.setProperty(
      "--scroll-fade-top",
      `${overflows && scroller.scrollTop > 1 ? Math.min(extent, scroller.scrollTop) : 0}px`,
    );
    scroller.style.setProperty(
      "--scroll-fade-bottom",
      `${overflows && remaining > 1 ? Math.min(extent, remaining) : 0}px`,
    );
  };
  const schedule = () => {
    if (!disposed && !frame) frame = requestAnimationFrame(update);
  };
  const resize = new ResizeObserver(schedule);
  const observeChildren = () => {
    resize.disconnect();
    resize.observe(scroller);
    for (const child of scroller.children) resize.observe(child);
    schedule();
  };
  const mutation = new MutationObserver(observeChildren);
  mutation.observe(scroller, { childList: true, subtree: true, characterData: true });
  scroller.setAttribute("data-scroll-fade", "");
  scroller.addEventListener("scroll", schedule, { passive: true });
  scroller.addEventListener("load", schedule, true);
  observeChildren();
  cancelAnimationFrame(frame);
  update();
  return () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect();
    mutation.disconnect();
    scroller.removeEventListener("scroll", schedule);
    scroller.removeEventListener("load", schedule, true);
    scroller.removeAttribute("data-scroll-fade");
    scroller.style.removeProperty("--scroll-fade-top");
    scroller.style.removeProperty("--scroll-fade-bottom");
  };
}
