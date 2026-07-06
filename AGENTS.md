# Fallout Mockery

Hex-grid tactical canvas game (Fallout-inspired). TypeScript + Vite.

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # typecheck + production build
npm run typecheck  # tsc only
```

## Architecture

```
src/
  main.ts              Entry point
  game/                Game orchestration + loop
  core/                Shared types and constants
  config/              Weapons, sprite sheet definitions
  state/               Initial state factory
  grid/                Hex math, pathfinding, tile queries
  entities/            Player/enemy factories
  systems/             Combat, movement, input, scheduling
  render/              Asset loading, sprite drawing, pipeline
  styles/              Global CSS
public/assets/img/     Sprite sheets and UI images
```

### Design principles

1. **GameState is the single source of truth** — systems read/write typed `GameState`; render reads only.
2. **Systems are stateless classes** — receive `GameContext` (`state`, `hexGrid`, `scheduler`, `barCanvas`).
3. **Render is pure per frame** — `RenderPipeline.render(state)` has no side effects on game logic.
4. **No god objects** — the old `canvas.js` `that` blob is gone; logic lives in focused modules.
5. **Strict TypeScript** — `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.

### Entity states

| `state` | Meaning        |
|---------|----------------|
| `0`     | Idle           |
| `1`     | Moving         |
| `2`     | Attacking      |
| `3`     | Hit (enemy)    |
| `-1`    | Death (enemy)  |

### Adding features

- New weapon → `src/config/weapons.ts`
- New sprite sheet → `src/config/sprites.ts` + `public/assets/img/`
- New system → `src/systems/`, wire from `CombatSystem` or `InputSystem`
- New render layer → `src/render/RenderPipeline.ts`

### Coordinate systems

Movement/pathfinding uses custom odd/even column neighbor rules (`grid/Pathfinding.ts`).
Rendering and hit-testing uses offset hex grid (`grid/HexGrid.ts`).
Both share column/row indices.

## For AI agents

Read `.cursor/rules/` before editing. Do not reintroduce global mutable singletons or factory functions that close over implicit context (`that` pattern).
