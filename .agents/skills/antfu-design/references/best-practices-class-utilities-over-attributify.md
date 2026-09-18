---
name: best-practices-class-utilities-over-attributify
description: Prefer normal class utilities over Attributify syntax for generated UnoCSS code; includes conversion patterns.
---

# Class Utilities Over Attributify

## Recommendation

- Generate normal class strings by default.
- Keep `presetAttributify()` only for compatibility with existing code, not as the primary authoring format.
- In shared examples and templates, always normalize to class-based utilities.

## Why This Works Better for Agents

- One attribute (`class`) is easier to compose, diff, and refactor than many utility-like attributes.
- Less ambiguity around merge behavior when multiple tools touch markup.
- More portable across JSX, template strings, markdown snippets, and framework-agnostic examples.

## Normalized Class Patterns

Use these as default templates when generating code:

```html
<div class="px2 py1 flex items-center gap-2 rounded border border-base">
  Content
</div>
```

```html
<button
  class="op75 hover:op100 disabled:op30! hover:bg-active disabled:pointer-events-none"
>
  Save
</button>
```

```html
<div class="pl2 border-l border-base">Meta</div>
```

```html
<button
  class="px2 py1 op75 flex items-center gap-2 rounded border border-base hover:bg-active"
>
  <span class="i-ph-arrow-clockwise-duotone"></span>
  refresh
</button>
```

## Config Pattern

If you want to discourage Attributify in new code:

```ts
import { defineConfig, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    // Do not include presetAttributify() for new projects.
  ],
})
```

If you need migration compatibility:

```ts
import { defineConfig, presetAttributify, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
})
```

But still write new components using `class="..."`.

<!--
Source references:
- https://github.com/antfu/node-modules-inspector/blob/main/packages/node-modules-inspector/src/uno.config.ts
- https://github.com/vitejs/devtools/blob/main/packages/ui/src/unocss/index.ts
- https://github.com/eslint/config-inspector/blob/main/uno.config.ts
- https://github.com/antfu/vite-plugin-inspect/blob/main/uno.config.ts
-->
