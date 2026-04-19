# Dungeon Pad

An iPad app for Dungeons & Dragons Dungeon Masters. Helps DMs run campaigns by organizing sessions, heroes, combat encounters, NPCs, maps, and a searchable compendium. Built with Expo for cross-platform reach, but iPad is the primary target; web is the dev preview surface.

## Phase

**Phase 1 (current)** — all screens built with mock data. Theme system (light/dark/system) and app-wide dynamic day/night scene background are in place. No real DB writes yet (schema exists, hook is wired, but screens read from `src/utils/mock-data.ts`).

**Coming next** — real DB integration, session running features, DnDBeyond/character-PDF import.

## Stack

- Expo SDK 55, React 19.2, React Native, TypeScript
- **Routing**: Expo Router (file-based) — `src/app/`. Uses a **JS-based stack navigator** (`@react-navigation/stack`) instead of the default native-stack — see "Navigation" below.
- **State**: Zustand — `src/theme/theme-store.ts`, `src/theme/background-store.ts`
- **DB**: expo-sqlite, schema in `src/db/schema.ts`, readiness via `useDatabase()`
- **Images**: expo-image (WebP), expo-image-picker for uploads
- **Fonts**: Magra (400 + 700) via `@expo-google-fonts/magra`

Import alias: `@/` → `src/`.

## Navigation

All stack layouts use `<JsStack>` from `src/components/navigation/JsStack.tsx` — a wrapper around `@react-navigation/stack`'s JS navigator, registered with `withLayoutContext` so it behaves like `expo-router`'s `Stack`. Both stacks in `src/app/(main)/_layout.tsx` and `src/app/(main)/campaigns/[campaignId]/_layout.tsx` apply `PAIRED_SLIDE_PRESET` (from the same file) for transitions.

**Why not native-stack**: iOS native-stack forces a parallax push animation (the outgoing screen lags behind the incoming one). Combined with transparent screens + a static `AppBackground` in the layout, that parallax reads as two screens crossfading/overlapping. The custom `cardStyleInterpolator` in `PAIRED_SLIDE_PRESET` paired-slides both screens at the same rate — outgoing translates left, incoming translates in from the right, no overlap — which is the only way to preserve the "static scene behind sliding cards" feel. Duration is 260ms.

**Don't revert** to `expo-router`'s native `Stack` without accepting that transition regression. If a native-stack-only feature is genuinely needed, flag it explicitly.

## Routing shape

```
src/app/
  _layout.tsx              ← fonts, DB hydrate, theme/bg hydrate, transparent NavigationThemeProvider
  (main)/
    _layout.tsx            ← renders <AppBackground /> + JsStack with PAIRED_SLIDE_PRESET
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

`background-store.ts` holds two overrides:

- **`customUri`** — single global override, managed from **Settings → Background**.
- **`customByCampaignId`** — per-campaign overrides keyed by campaignId, managed from the **Edit Background** button on the campaign dashboard (opens an inline modal).

`AppBackground` parses the campaignId out of `usePathname()` and resolves in this order: **campaign override → global override → default day/night scene**. Anywhere inside `/(main)/campaigns/<id>/...` picks up that campaign's override if set. Persistence is `localStorage` on web; native persistence is not yet wired — reloads lose custom backgrounds on iPad.

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

Other primitives: `Accordion`, `Avatar`, `Badge`, `Button`, `Divider`, `InputField`, `PaginationDots`, `FadeMask`.

## Dev + verification

- **Web dev server**: started via `preview_start` (Claude Code preview) or `npx expo start --web`
- **Verify UI changes** via `preview_*` tools: snapshot, inspect, screenshot, click, eval. Prefer these over asking the user to test manually. Note: `preview_screenshot` occasionally times out; retry or fall back to `preview_eval` + `preview_snapshot`.
- **Target breakpoints**: iPad portrait (~820px), iPad landscape (~1180px). Design desktop/wide first, verify at iPad widths before shipping.

## Working style

User is a UX/UI designer with a React design-system background, new to writing app code. Frame explanations in design-system terms where it maps cleanly. Prefer terse responses, small diffs, and verified-in-preview changes. Don't over-engineer — no speculative abstractions, no fallbacks for impossible states. When a change is observable in the browser, verify it there before reporting done.
