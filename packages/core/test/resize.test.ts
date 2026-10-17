import { describe, expect, it } from "vitest";
import { resizeBoundary } from "../src/model/tree";
import type { SplitNode } from "../src/model/types";
const split: SplitNode = {
  kind: "split",
  id: "split",
  axis: "y",
  weights: [1, 1],
  children: [
    { kind: "panel", id: "a", views: ["a"], selected: "a" },
    { kind: "panel", id: "b", views: ["b"], selected: "b" },
  ],
};
describe("divider minimums", () => {
  it("respects minimums when both panels fit", () => {
    expect(resizeBoundary(split, 0, 0.05, () => 0.3).weights).toEqual([0.3, 0.7]);
  });
  it("still moves in both directions when the requested minimums cannot fit", () => {
    expect(resizeBoundary(split, 0, 0.35, () => 0.55).weights[0]).toBeCloseTo(0.35);
    expect(resizeBoundary(split, 0, 0.65, () => 0.55).weights[0]).toBeCloseTo(0.65);
    expect(resizeBoundary(split, 0, 0, () => 0.55).weights[0]).toBeGreaterThan(0);
  });
});
