import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { attachScrollFade } from "../src/runtime/scroll-fade";

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => setTimeout(() => fn(0), 0));
  vi.stubGlobal("cancelAnimationFrame", clearTimeout);
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("fades only edges with remaining content, responds to short content, and cleans up", () => {
  const el = document.createElement("div");
  let height = 900;
  Object.defineProperties(el, { scrollHeight: { get: () => height }, clientHeight: { value: 300 } });
  const dispose = attachScrollFade(el);
  const edge = (name: string) => el.style.getPropertyValue(`--scroll-fade-${name}`);
  expect(edge("top")).toBe("0px");
  expect(edge("bottom")).toBe("40px");
  el.scrollTop = 200;
  el.dispatchEvent(new Event("scroll"));
  vi.runAllTimers();
  expect(edge("top")).toBe("40px");
  expect(edge("bottom")).toBe("40px");
  el.scrollTop = 600;
  el.dispatchEvent(new Event("scroll"));
  vi.runAllTimers();
  expect(edge("bottom")).toBe("0px");
  height = 100;
  el.scrollTop = 0;
  el.dispatchEvent(new Event("scroll"));
  vi.runAllTimers();
  expect(edge("top")).toBe("0px");
  expect(edge("bottom")).toBe("0px");
  dispose();
  dispose();
  el.dispatchEvent(new Event("scroll"));
  vi.runAllTimers();
  expect(el.hasAttribute("data-scroll-fade")).toBe(false);
  expect(edge("top")).toBe("");
});
it("accepts a custom fade length and clamps it for short viewports", () => {
  const el = document.createElement("div");
  Object.defineProperties(el, { scrollHeight: { value: 900 }, clientHeight: { value: 100 } });
  const dispose = attachScrollFade(el, { size: 80 });
  expect(el.style.getPropertyValue("--scroll-fade-bottom")).toBe("50px");
  dispose();
});
