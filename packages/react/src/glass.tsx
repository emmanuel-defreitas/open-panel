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

      muted

      radius={10}
      optics={{
        depth: 0.8,
        bend: 0.4,
        frost: selected ? 4 : 8,
        brightness: selected ? (theme === "light" ? -0.02 : -0.3) : 0,
        strength: 0.2,
        dispersion: 0.2,
        sheen: 0.1,

        curvature: 0.2,
        sheenAngle: 0.7,
        softEdge: true,
        specular: selected ? 1 : 0.1,
        sheenWidth: 1,

        glow: 0.1,
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
