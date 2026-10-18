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
      // muted
      radius={10}
      optics={{
        depth: 0.5,
        bend: 0.9,
        frost: 1.5,
        strength: 0.4,
        dispersion: 0,
        sheen: 0.5,
        curvature: 0.3,
        sheenAngle: 0.2,
        softEdge: true,
        bendWidth: 0.3,
        specular: 0.7,
      }}

      style={{ width: "100%", height: "100%" }}
      {...props}
    >
      {/* A child enables the package's backdrop material mode. */}
      <span className="tab-glass-fill" />
    </Glass>
  );
}
