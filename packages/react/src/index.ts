export {
    Workspace,
    WorkspaceProvider,
    ViewType,
    Split,
    Panel,
    View,
    Stage,
    Floating,
    useWorkspace,
    useOptionalWorkspace,
    useWorkspaceState,
    useWorkspaceSelector,
    useView,
    useIsCompact,
    useOptionalView,
    useViewTitle,
    useViewBadge,
    useCloseGuard,
} from "./Workspace";
export type {
    WorkspaceProps,
    ViewTypeProps,
    SplitProps,
    PanelProps,
    ViewProps,
    StageProps,
    FloatingProps,
    ViewApi,
} from "./Workspace";
export { layout, createDocument, formatCombo } from "open-panel-core";
export type * from "open-panel-core";

export { useViewState, usePanelViews, useFocusedView, useWorkspaceActions, useWorkspaceEvent } from "./hooks";
