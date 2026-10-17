# open-panel-element

Open-Panel as a `<open-panel-workspace>` custom element, for any framework or none.

Install it with the core package:

```sh
bun install open-panel-element open-panel-core
```

Register the element, then declare the workspace in HTML:

```html
<script type="module">
    import "open-panel-element";
</script>
<link rel="stylesheet" href="node_modules/open-panel-element/dist/style.css" />

<open-panel-workspace theme="dark" style="height: 100vh">
    <template data-view-type="notes" data-title="Notes"><textarea></textarea></template>
    <open-panel-split weights="1 3">
        <open-panel-view type="notes"></open-panel-view>
        <open-panel-stage></open-panel-stage>
    </open-panel-split>
</open-panel-workspace>
```

Without a bundler, import `open-panel-element/standalone` (a single self-contained module).

Documentation, guides and examples are in the [Open-Panel repository](https://github.com/emmanuel-defreitas/open-panel).

## License

Free for non-commercial use. Commercial use requires an active GitHub Sponsorship at the applicable tier or an enterprise license. See [LICENSE.md](LICENSE.md).
