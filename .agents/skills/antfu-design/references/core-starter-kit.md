---
name: core-starter-kit
description: Framework-agnostic UnoCSS starter setup with class-based utilities, semantic shortcuts, and base light/dark shell styles.
---

# Starter Kit

Use this as a copy-paste baseline for any UnoCSS project (React, Vue, Svelte, Solid, or plain HTML).

## 1) `uno.config.ts`

```ts
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetIcons,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    fontSize: {
      micro: ['0.625rem', '0.875rem'],
      mini: ['0.6875rem', '1rem'],
      compact: ['0.8125rem', '1.125rem'],
    },
    colors: {
      primary: {
        300: '#7CBC71',
        400: '#49833E',
        600: '#396831',
        DEFAULT: '#49833E',
      },
    },
  },
  shortcuts: [
    {
      'color-base': 'color-neutral-800 dark:color-neutral-200',
      'bg-base': 'bg-white dark:bg-#111',
      'bg-secondary': 'bg-#eee dark:bg-#222',
      'border-base': 'border-#8882',

      'bg-active': 'bg-#8881',
      'color-active': 'color-primary-600 dark:color-primary-300',
      'border-active': 'border-primary-600/25 dark:border-primary-400/25',

      'btn-action':
        'inline-flex items-center gap-2 rounded border border-base px2 py1 op75 hover:op100 hover:bg-active disabled:pointer-events-none disabled:op30!',
      'btn-action-sm': 'btn-action text-sm',
      'btn-action-icon':
        'inline-flex h-8 w-8 items-center justify-center rounded border border-base op75 hover:op100 hover:bg-active disabled:pointer-events-none disabled:op30!',

      'glass-panel': 'rounded-lg border border-base bg-glass shadow',
      'op-fade': 'op65 dark:op55',
      'op-mute': 'op30 dark:op25',

      'z-top-nav': 'z-60',
      'z-panel-content': 'z-70',
      'z-drawer-backdrop': 'z-90',
      'z-drawer-content': 'z-100',

      'h-nav': 'h-10',
      'pad-safe':
        'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]',
    },
    [
      /^bg-glass(:\d+)?$/,
      ([, opacity = ':75']) =>
        `bg-white${opacity} dark:bg-#111${opacity} backdrop-blur-8`,
    ],
  ],
  presets: [
    presetWind4(),
    presetIcons({ scale: 1.2 }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans:200,400,700',
        mono: 'DM Mono:400,500',
      },
      processors: createLocalFontProcessor({
        fontAssetsDir: './public/assets/fonts',
        fontServeBaseUrl: '/assets/fonts',
      }),
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
```

Notes:

- Class-based utilities are the default pattern (no Attributify preset).
- All semantic shortcuts include light/dark-compatible primitives.

## 2) Base global styles (`styles.css`)

```css
html,
body,
#app {
  height: 100vh;
  height: 100dvh;
  margin: 0;
  padding: 0;
}

html {
  --uno: bg-base color-base font-sans;
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
  background-color: #111;
}

@media (prefers-color-scheme: dark) {
  html:not(.light) {
    background-color: #111;
  }
}
```

## 3) Shell composition example

```html
<div
  class="of-hidden pad-safe flex h-screen w-screen flex-col bg-base font-sans color-base"
>
  <header
    class="h-nav z-top-nav flex shrink-0 items-center gap-2 border-b border-base bg-base px-3"
  >
    <button class="btn-action-icon" aria-label="Menu">
      <span class="i-ph-list-duotone"></span>
    </button>
    <span class="truncate font-mono text-xs">workspace-name</span>
  </header>

  <main class="of-auto min-h-0 flex-1">
    <section class="flex flex-col gap-3 p-4">
      <button class="btn-action-sm self-start">
        <span class="i-ph-arrow-clockwise-duotone"></span>
        refresh
      </button>

      <div class="glass-panel p-3">
        <div class="text-sm">Panel content</div>
        <div class="text-mini mt-1 op-fade">Secondary metadata</div>
      </div>
    </section>
  </main>
</div>
```

<!--
Source references:
- https://github.com/antfu/node-modules-inspector/blob/main/packages/node-modules-inspector/src/uno.config.ts
- https://github.com/vitejs/devtools/blob/main/packages/ui/src/unocss/index.ts
- https://github.com/vitejs/devtools/blob/main/packages/ui/src/unocss/shared-shortcuts.ts
- https://github.com/eslint/config-inspector/blob/main/uno.config.ts
- https://github.com/antfu/vite-plugin-inspect/blob/main/uno.config.ts
- https://github.com/antfu/agent-container/blob/main/hub/uno.config.ts
- https://github.com/antfu/agent-container/blob/main/hub/app/styles.css
-->
