# Open-Panel

The TypeScript workspace library lives in `packages/core`, with React and custom
element adapters in `packages/react` and `packages/element`. The browser examples
remain under `demo`.

The demo uses Cuelume for quiet interaction sounds, following
[its integration guide](https://cuelume.dev/agents.md). The Sound toggle persists
locally; audio starts only after interaction. Tab selection, panel open/close,
and drag pickup/drop use subtle cues. Hover and continuous pointer movement are
silent. Sound bindings and observers are cleaned up when the demo unmounts.
