import { Glass } from "@samasante/liquid-glass";
import type { ComponentProps } from "react";
import type { Theme } from "open-panel-core";
import { useView } from "./Workspace";
export type GlassTabBackgroundProps = Omit<ComponentProps<typeof Glass>, "children"> & { theme?: Theme };
// The icon slot keeps the decorative background attached to its tab.
export function GlassTabBackground({ theme = "dark", ...props }: GlassTabBackgroundProps) {
  const { selected } = useView();
  return (
    <Glass
      aria-hidden="true"
      hidden={!selected}
      radius={10}
      optics={{
        depth: 0.4,
        bend: 0.2,
        frost: selected ? 2 : 0,
        brightness: selected ? (theme === "light" ? -0.06 : -0.3) : 0,
        strength: 0.2,
        dispersion: 0,
        sheen: 0.5,
        curvature: 0.2,
        sheenAngle: 2,
        softEdge: true,
        bendWidth: 0.1,
        specular: selected ? (theme === "light" ? 0.85 : 0.5) : 0,
        sheenWidth: theme === "light" ? 0.2 : 0,
        glow: 0.5,
        sheenDark: theme === "light",
      }}

      style={{ width: "100%", height: "100%" }}
      {...props}
    >
      {/* A child enables the package's backdrop material mode. */}
      <span className="tab-glass-fill" />
    </Glass>
  );
}
