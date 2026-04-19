# Dungeon Pad

An iPad app for Dungeons & Dragons Dungeon Masters. Helps DMs run campaigns by organizing sessions, heroes, combat encounters, NPCs, maps, and a searchable compendium. Built with Expo for cross-platform reach, but iPad is the primary target; web is the dev preview surface.

## Phase

**Phase 1 (current)** — all screens built with mock data. Theme system (light/dark/system) and app-wide dynamic day/night scene background are in place. No real DB writes yet (schema exists, hook is wired, but screens read from `src/utils/mock-data.ts`).

**Coming next** — per-campaign background override (designed, deferred), real DB integration, session running features, DnDBeyond/character-PDF import.

## Stack

- Expo SDK 55, React 19.2, React Native, TypeScript
- **Routing**: Expo Router (file-based) — `src/app/`
- **State**: Zustand — `src/theme/theme-store.ts`, `src/theme/background-store.ts`
- **DB**: expo-sqlite, schema in `src/db/schema.ts`, readiness via `useDatabase()`
- **Images**: expo-image (WebP), expo-image-picker for uploads
- **Fonts**: Magra (400 + 700) via `@expo-google-fonts/magra`

Import alias: `@/` → `src/`.

## Routing shape

```
src/app/
  _layout.tsx              ← fonts, DB hydrate, theme/bg hydrate, transparent NavigationThemeProvider
  (main)/
    _layout.tsx            ← renders <AppBackground /> + Stack with transparent contentStyle
    campaigns/
      index.tsx            ← campaigns list
      [campaignId]/
        _layout.tsx
        index.tsx          ← campaign dashboard
        sessions/[sessionId].tsx
        heroes/[heroId].tsx
        combat/[combatId].tsx
        npcs/[npcId].tsx
        maps/[mapId].tsx
        compendium/index.tsx   ← campaign-scoped compendium
    compendium/
      index.tsx            ← full compendium (all campaigns)
      [itemId].tsx         ← document viewer
    settings/index.tsx     ← theme picker
```

## Theming

Every theme-aware component follows this pattern:

```tsx
const colors = useColors();
const styles = useMemo(() => StyleSheet.create({ ... }), [colors]);
```

- `useColors()` resolves the active palette (from `src/theme/palettes.ts`)
- `useThemeMode()` → `'light' | 'dark'` (resolved)
- `useThemePreference()` → `[preference, setPreference]` where preference is `'system' | 'light' | 'dark'`
- Static design tokens (typography, spacing, radii, componentSizes): `src/theme/tokens.ts`

**Never hardcode colors** — always read from `colors.*`. Tokens are safe to import anywhere.

## Background system

App-wide scene lives behind every `(main)` route via `src/components/ui/AppBackground.tsx`, mounted in `(main)/_layout.tsx`. It renders a day or night WebP from `assets/images/` based on the active theme, with a semi-transparent `sceneTint` overlay.

For this to show through, **every screen/layout in the chain must be transparent**:

- `src/app/_layout.tsx` — `contentStyle: { backgroundColor: 'transparent' }`, wrapped in `<ThemeProvider>` with `{ background: 'transparent', card: 'transparent' }` to neutralize React Navigation's default card background
- `src/app/(main)/_layout.tsx` — same `contentStyle`
- Each screen's root container — `backgroundColor: 'transparent'` (never `colors.background`)

If you add a new layout, follow this rule. Opaque surfaces (cards, panels, inputs) should use `colors.surface` and friends, not `colors.background`.

Custom per-page overrides exist in `background-store.ts` (keyed by pathname). The floating "Edit Background" button on `AppBackground` manages them. **Per-campaign override is planned but not implemented.**

## Conventions

- **Components**: `src/components/<category>/<Name>.tsx`. Categories: `ui`, `campaign`, `compendium`, `navigation`, `session`.
- **Types**: `src/types/<domain>.ts`, re-export barrel in `src/types/index.ts`.
- **Mock data**: `src/utils/mock-data.ts` — screens read from this until DB is wired.
- **Styles**: `useMemo` + `StyleSheet.create` inside the component (captures `colors` for live theme switching). Don't hoist stylesheets above components — they'd be frozen to the initial palette.
- **File naming**: PascalCase for components, kebab-case for utilities/hooks.
- **No emojis** in code or UI unless explicitly requested.
- **Minimal comments** — only for genuinely non-obvious WHY. Don't annotate what the code already shows.

## Key UI primitives (src/components/ui)

`Card` is the base for all tactile surfaces. It handles hover/press states (shadow flattens on hover, inner top-shadow on press) and provides consistent border, radius, padding. `CampaignCard`, `MiniCard`, and `NewCampaignCard` all compose `Card`. Don't reinvent tactile feedback — wrap `Card`.

Other primitives: `Accordion`, `Avatar`, `Badge`, `Button`, `Divider`, `InputField`, `PaginationDots`.

## Dev + verification

- **Web dev server**: started via `preview_start` (Claude Code preview) or `npx expo start --web`
- **Verify UI changes** via `preview_*` tools: snapshot, inspect, screenshot, click, eval. Prefer these over asking the user to test manually. Note: `preview_screenshot` occasionally times out; retry or fall back to `preview_eval` + `preview_snapshot`.
- **Target breakpoints**: iPad portrait (~820px), iPad landscape (~1180px). Design desktop/wide first, verify at iPad widths before shipping.

## Working style

User is a UX/UI designer with a React design-system background, new to writing app code. Frame explanations in design-system terms where it maps cleanly. Prefer terse responses, small diffs, and verified-in-preview changes. Don't over-engineer — no speculative abstractions, no fallbacks for impossible states. When a change is observable in the browser, verify it there before reporting done.
