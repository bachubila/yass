# YASS - Yet Another Sync Service

A self-hostable, open-source sync platform that follows you everywhere - terminal, browser, mobile, wherever you are.

## Project Structure

This is a monorepo managed with pnpm workspaces and Turborepo.

```
yass/
├── apps/
│   ├── web/                 # SvelteKit dashboard
│   ├── api/                 # Hono API layer
│   ├── mobile/              # React Native (Expo)
│   └── cli/                 # Go CLI (yass)
├── packages/
│   ├── convex/              # Convex backend functions
│   ├── shared-types/        # TypeScript types shared across packages
│   └── ui/                  # Shared Svelte components
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── .github/workflows/       # CI/CD pipelines
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.23.0+
- Go 1.21+ (for CLI development)

### Installation

```bash
pnpm install
```

### Development

```bash
# Run all dev servers
pnpm dev

# Run specific workspace
pnpm --filter @yass/web dev
pnpm --filter @yass/api dev
pnpm --filter @yass/mobile start
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @yass/web build
```

## TypeScript Configuration

All TypeScript projects extend from `tsconfig.base.json` which provides:
- Strict type checking
- Path aliases for shared packages (`@yass/shared-types`, `@yass/ui`)
- Modern ES2022 target
- Module resolution optimized for bundlers

Each package has its own `tsconfig.json` that extends the base config with package-specific settings.

## License

MIT

