import { useEffect, useState } from "react";
import { bind, play, setEnabled, setVolume, unlock, type SoundName } from "cuelume";
import type { WorkspaceHandle } from "open-panel-react";

const SOUND_KEY = "open-panel-playground:sound";

export function useInteractionSounds(ws: WorkspaceHandle | null) {
  const [enabled, setSound] = useState(() => {
    try {
      return localStorage.getItem(SOUND_KEY) !== "off";
    } catch {
      return true;
    }
  });
  useEffect(() => {
    setVolume(0.22);
    return bind();
  }, []);
  useEffect(() => {
    setEnabled(enabled);
    try {
      localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
    } catch {
      /* Optional persistence. */
    }
  }, [enabled]);

  useEffect(() => {
    if (!ws) return;
    let previous = ws.getSnapshot();
    let lastCue = -Infinity;
    const cue = (name: SoundName) => {
      // A single action may also select a tab or change focus. Sound it once.
      const now = performance.now();
      if (now - lastCue < 100) return;
      lastCue = now;
      play(name, { emphasis: "subtle" });
    };
    const offOpen = ws.on("open", () => cue("open"));
    const offClose = ws.on("close", () => cue("close"));
    const offSelect = ws.subscribe(() => {
      const next = ws.getSnapshot();
      if (
        next.views.length === previous.views.length &&
        !next.dragging &&
        next.views.some(
          (view) => view.selected && previous.views.some((old) => old.id === view.id && !old.selected),
        )
      ) {
        cue("select");
      }
      previous = next;
    });
    const root = ws.element;
    let dragging = root.hasAttribute("data-dragging");
    let cancelled = false;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dragging) cancelled = true;
    };
    const observer = new MutationObserver(() => {
      const next = root.hasAttribute("data-dragging");
      if (next === dragging) return;
      if (next) {
        cancelled = false;
        cue("select");
      } else cue(cancelled ? "close" : "tap");
      dragging = next;
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-dragging"] });
    window.addEventListener("keydown", onKey, true);
    return () => {
      offOpen();
      offClose();
      offSelect();
      observer.disconnect();
      window.removeEventListener("keydown", onKey, true);
    };
  }, [ws]);

  async function toggleSound() {
    if (enabled) {
      setEnabled(false);
      setSound(false);
      return;
    }
    setEnabled(true);
    const ready = await unlock();
    setEnabled(ready);
    setSound(ready);
    if (ready) play("toggle", { emphasis: "subtle" });
  }
  return { enabled, toggleSound };
}
