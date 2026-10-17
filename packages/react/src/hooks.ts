import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { ViewState, WorkspaceEvents } from "open-panel-core";
import { useOptionalView, useOptionalWorkspace, useWorkspaceState } from "./Workspace";

const subscribeEmpty = () => () => {};
const getEmpty = () => null;

/** Reactive presentation state for a view by ID, or the enclosing view.
 * Returns null before mount, after close, or when no view matches. */
export function useViewState(viewId?: string): ViewState | null {
  const ws = useOptionalWorkspace();
  const own = useOptionalView();
  // Track view creation/closure independently of presentation updates.
  const snapshot = useWorkspaceState();
  const id = viewId ?? own?.id;
  const view = id && snapshot.views.some((view) => view.id === id) ? ws?.view(id) : null;
  return useSyncExternalStore(view?.subscribe ?? subscribeEmpty, view?.getState ?? getEmpty, getEmpty);
}

/** Tabs in layout order for a panel ID, or the enclosing view's panel. */
export function usePanelViews(panelId?: string) {
  const own = useViewState();
  const snapshot = useWorkspaceState();
  const id = panelId ?? own?.panelId;
  return useMemo(() => snapshot.views.filter((view) => view.panelId === id), [snapshot.views, id]);
}

/** Focused view information, including when used in a surrounding toolbar. */
export function useFocusedView() {
  const snapshot = useWorkspaceState();
  return snapshot.views.find((view) => view.id === snapshot.focusedView) ?? null;
}

/** Stable workspace commands. Null until the workspace mounts under its provider. */
export function useWorkspaceActions() {
  const ws = useOptionalWorkspace();
  return useMemo(
    () =>
      ws
        ? {
            open: ws.open,
            close: ws.close,
            focus: ws.focus,
            select: ws.select,
            hide: ws.hide,
            restore: ws.restore,
            float: ws.float,
            dock: ws.dock,
            toggleDock: ws.toggleDock,
            reset: ws.reset,
            setDocument: ws.setDocument,
            setTitle: ws.setTitle,
            setParams: ws.setParams,
            navigation: ws.navigation,
          }
        : null,
    [ws],
  );
}

/** Subscribe with automatic cleanup and the latest callback, without resubscribing
 * every time the component renders. Works anywhere inside WorkspaceProvider. */
export function useWorkspaceEvent<E extends keyof WorkspaceEvents>(event: E, handler: WorkspaceEvents[E]) {
  const ws = useOptionalWorkspace();
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => {
    if (!ws) return;
    const listener = ((...args: Parameters<WorkspaceEvents[E]>) => {
      (latest.current as (...values: Parameters<WorkspaceEvents[E]>) => void)(...args);
    }) as WorkspaceEvents[E];
    return ws.on(event, listener);
  }, [ws, event]);
}
