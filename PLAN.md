# YASS - Implementation Plan
## Yet Another Sync Service

---

## 1. Project Overview

### Elevator Pitch
YASS is a self-sync platform that follows you everywhere - terminal, browser, mobile, wherever you are. Built out of frustration with closed-source sync platforms that force you to choose between web OR mobile OR CLI. With YASS, you never leave your zen flow in vim/tmux, and Convex websockets ensure you never face sync mismatches.

### Target Users
- Primary: The developer (you)
- Secondary: Tech-savvy folks who value open source
- Distribution: Fully open source, self-hostable

### Project Philosophy
Unseriously serious - it's a good product that follows you around, but don't expect corporations to adopt it. It's open source, self-hostable, built from source if you want. The documentation will have 2000s fangirl diary aesthetics because why not.

### Non-Negotiables
1. **Self-hostable** - This is a key selling point in documentation
2. **Encryption** - Elementary requirement for user data
3. **Open Source** - Fully FOSS, no proprietary lock-in
4. **Free tier** - Text and links should be free

### Monetization Strategy
Only storage and bandwidth costs are monetized. Everything else remains free and open source.

---

## 2. Architecture Decision Records

### Why SvelteKit for Web Dashboard
- Best framework, period
- Superior developer experience
- Fast, clean, perfect for this kind of project

### API Layer: Hono
**Decision:** Hono for the API layer

**Reasoning:**
- Previous experience with Hono (familiar territory)
- TypeScript route limit issue existed with 100+ routes, but YASS will have ~15-20 routes maximum
- OpenAPI spec generation makes Go CLI integration cleaner
- Fast and lightweight

**Alternatives considered:**
- tRPC: Great type safety but Go CLI would need HTTP adapter
- oRPC: New and interesting but smaller ecosystem

### Mobile: React Native with Expo
**Decision:** React Native (Expo)

**Reasoning:**
- TypeScript makes the developer happy (self-proclaimed soydev)
- Code sharing potential with web
- Expo simplifies development and deployment

### CLI: Go
**Decision:** Go for CLI client

**Reasoning:**
- Single binary distribution - no Node.js installation required
- Cross-platform compilation
- Fast and efficient
- Professional CLI framework ecosystem (Cobra)

**Alternative considered:**
- Rust: Would require psychiatric evaluation if chosen

### Monorepo: pnpm + Turborepo
**Decision:** pnpm workspaces with Turborepo

**Reasoning:**
- Turborepo provides build caching
- Integrates well with Vercel deployment
- pnpm is fast and efficient

### Self-Hosting Strategy
**Decision:** Developer options/suite in the application

**Implementation:**
- Users can input their own Convex database URL
- Users provide their own UploadThing token
- No Docker complexity
- Users manage their own Convex quotas
- They use the hosted web interface but their own backend

---

## 3. Data Models

### Core Schema

```typescript
// Convex schema
syncItems: {
  userId: string,
  type: "text" | "link" | "image",
  content: string,  // encrypted content or file reference
  metadata: {
    source: "web" | "cli" | "mobile",
    userAgent?: string,  // tracked on web
    createdAt: number,
    updatedAt: number,
  },
  // Encryption fields
  encryptedContent: string,
  iv: string,
  salt: string,
}

users: {
  email: string,
  passwordHash: string,  // Argon2
  storageUsed: number,
  storageLimit: number,  // 100MB for free tier
  createdAt: number,
}

apiKeys: {
  userId: string,
  key: string,  // hashed
  name: string,  // user-provided label
  lastUsed: number,
  createdAt: number,
}
```

### Metadata Tracking
- Timestamps (created, updated)
- Source client (web, CLI, mobile)
- User agent (web only)

### Features Deferred to V2
- Folders
- Favorites
- Tags
- Collections/relationships between items

### Search Strategy
- Full-text search on text items
- Convex text search indices
- Search by type, date, source

### Encryption Strategy
**Status:** TBD - requires research

**Current thinking:**
- User password is used to derive encryption key
- Client-side encryption before storing in Convex
- AES-256-GCM for encryption/decryption

**Flow (to be confirmed):**
1. User enters password
2. Derive encryption key: `key = Argon2id(password, salt)`
3. Encrypt: `encrypted = AES-256-GCM(content, key, randomIV)`
4. Store: encryptedContent + IV + salt
5. Password hash stored separately for authentication

**Recommended libraries for research:**
- [libsodium](https://libsodium.gitbook.io/doc/)
- [@noble/ciphers](https://github.com/paulmillr/noble-ciphers)

**Key question to resolve:**
- Password recovery mechanism vs zero-knowledge encryption
- If password recovery via email is required, may need server-side encryption or key escrow

### Versioning and History
Not implemented in V1. Deferred to V2.

---

## 4. Authentication & Security

### Auth Provider
**Convex Auth** with email/password authentication

### Authentication Flow

**Web Client:**
- Direct Convex connection with environment variables
- Uses `ctx.auth.getUserIdentity()` for auth verification
- Session management via Convex Auth

**Mobile & CLI:**
- Cannot safely store Convex environment variables
- Must authenticate through API layer
- Two token types supported:

#### Token Type 1: Login Tokens (Mobile primary use)
```
Mobile/CLI → API POST /auth/login (email+password)
          → API calls Convex Auth
          → Returns JWT token
          → Client stores token securely
          → Future requests include token in Authorization header
```

#### Token Type 2: API Keys (CLI primary use)
```
User in web dashboard → Generate API key
                      → Copy key (format: nsync_xxxxxxxxxxxx)
                      → Store in ~/.yass/config.json
                      → CLI uses key in Authorization header
```

### API Middleware
Authentication middleware verifies tokens by calling `ctx.auth.getUserIdentity()` from Convex Auth. This provides user identity for subsequent operations.

### CORS Strategy
**Status:** TBD - requires research

**Current thinking:**
- No cookies, using Bearer tokens in Authorization headers
- Detection via user agent for mobile/web clients
- Likely permissive CORS for V1

**Token storage:**
- Web: localStorage or memory
- Mobile: Secure storage (Keychain/Keystore)
- CLI: `~/.yass/config.json`

### Rate Limiting
**V1:** None
**V2:** Implement using [Arcjet](https://arcjet.com/)

### Self-Hosting Security
Users who self-host are independent:
- Create their own Convex account
- Create their own UploadThing account
- Manage their own quotas and limits
- Use the hosted web interface with their own backends
- No burden on main infrastructure

---

## 5. Phase 1: Web Dashboard

### Tech Stack
- Framework: SvelteKit
- Deployment: Vercel
- Styling: TBD (likely TailwindCSS)

### Routes

```
/                  - Marketing landing page
/dashboard         - Main sync items view
/signin            - Authentication
/signup            - Registration
/settings          - API key generation, developer options
```

### Dashboard Features

**Main View (`/dashboard`):**
- List view of all sync items
- Sorted by recently added (default)
- Pagination
- Breadcrumb navigation (no sidebar)

**Item Display:**
- Copy button (for text/links)
- Download button (for images)
- Delete button
- Type indicators (text/link/image)

**Top Bar:**
- Search bar (full-text search)
- "Add New Item" button
- Sort/filter options (by type, date)

**Add New Item:**
- Text input
- Link input
- Image upload deferred to after V1 initial release

**Real-time Updates:**
- Convex subscriptions for live dashboard updates
- Items added from CLI/mobile appear instantly

### Features Deferred to V2
- File drag-and-drop upload
- Dark mode (requires Figma design work)
- Sidebar navigation
- Folders/favorites UI
- Bulk operations

### Settings Page
- API key generation
- API key management (list, revoke)
- Developer options (Convex URL, UploadThing token for self-hosting)
- Account settings
- Storage usage display

---

## 6. Phase 2: API Layer

### Tech Stack
- Framework: Hono
- Runtime: Node.js on Vercel Serverless
- OpenAPI: Auto-generated from Hono

### API Routes

```
POST   /auth/login         - Email/password login, returns JWT
POST   /auth/register      - User registration
GET    /auth/verify        - Verify token validity
POST   /items              - Create new sync item
GET    /items              - List items (paginated, filtered)
GET    /items/:id          - Get specific item
PATCH  /items/:id          - Update item (V2)
DELETE /items/:id          - Delete item
POST   /api-keys           - Generate new API key (authenticated)
GET    /api-keys           - List user's API keys
DELETE /api-keys/:id       - Revoke API key
```

### Middleware Stack (in order)
1. CORS handling (TBD configuration)
2. Request logging (Axiom)
3. Authentication verification (via Convex Auth)
4. Error handling (Sentry)

### Authentication Middleware
Uses `ctx.auth.getUserIdentity()` from Convex Auth to verify tokens and retrieve user identity. Attaches user info to request context.

### Error Handling
- Custom error codes and formats
- Integration with Sentry for error tracking
- Integration with Axiom for request logging
- Standard HTTP status codes with descriptive messages

### Rate Limiting
**V1:** Not implemented
**V2:** Arcjet integration

---

## 7. Phase 3: Mobile App

### Tech Stack
- Framework: React Native with Expo
- Workflow: Expo Go (managed workflow)
- HTTP Client: Axios
- Deployment: App Store + Google Play

### Screens (V1)

```
/login              - Authentication
/signup             - Registration
/home               - Main list view (matches web dashboard)
/item/:id           - Item detail view
/add                - Add new item screen
/settings           - Logout, developer options, notification preferences
```

### Core Features

**Main List View:**
- Same functionality as web dashboard
- Pull-to-refresh
- Infinite scroll pagination
- Search bar
- Filter by type

**Add New Item:**
- Text input
- Link input
- Image selection from gallery

**Real-time Sync:**
- Convex subscriptions for live updates
- Items sync from other devices appear instantly

**Push Notifications (V1):**
- Opt-in notifications
- User configures what triggers notifications
- Default: "New item synced from cli/web/mobile"
- Notification preferences in settings

### Features Deferred to V2
- Share sheet integration (share from other apps into YASS)
- Biometric authentication (FaceID/Fingerprint)
- Advanced sharing options

### API Integration
- Mobile app communicates with API layer (not directly with Convex)
- Uses login flow to obtain JWT token
- Token stored in secure storage (Keychain on iOS, Keystore on Android)
- All requests include Authorization header

---

## 8. Phase 4: CLI Client

### Tech Stack
- Language: Go
- CLI Framework: Cobra (industry standard)
- HTTP Client: Native Go net/http
- Config Format: JSON

### CLI Name
**`yass`** - Yet Another Sync Service

### Installation Methods
1. **curl script:** `curl -sSL https://install.syncnsync.com | bash`
2. **Pre-built binaries:** GitHub releases for multiple platforms
3. **npm global:** `npm install -g yass-cli`

### Configuration
- Config file location: `~/.yass/config.json`
- Stores API endpoint, API key, user preferences

```json
{
  "apiEndpoint": "https://api.syncnsync.com",
  "apiKey": "nsync_xxxxxxxxxxxx",
  "defaultFormat": "table"
}
```

### Commands

```bash
yass login                    # Interactive auth flow, stores API key
yass logout                   # Clear local auth
yass add <text>               # Add text item
yass add --link <url>         # Add link
yass list                     # List all items (table format)
yass list --json              # List with JSON output
yass list --yaml              # List with YAML output
yass search <query>           # Search items
yass get <id>                 # Get item and copy to clipboard
yass delete <id>              # Delete item
yass config                   # View/edit config
```

### Output Formats
- **Default:** `console.table()` style display
- **Flags:** `--json`, `--yaml` for scripting
- **Colorized output:** Different colors for different file types

### Special Features
- `yass get <id>` automatically copies content to system clipboard
- Colorized output based on item type
- Interactive mode for sensitive operations (delete confirmations)

### API Integration
- Communicates with API layer using API keys
- API key generated in web dashboard, stored in config file
- All requests include API key in Authorization header

---

## 9. Phase 5: Browser Extension

**Status:** Deferred to V2

### Potential Features (TBD)
- Right-click context menu: "Save to YASS"
- Highlight text and save
- Quick popup with recent items
- Platform-specific scrapers:
  - Instagram posts
  - Twitter/X tweets
  - Bluesky posts
  - Google Drive files

### Implementation Notes
- Manifest V3 required
- Target: Chrome/Edge (Chromium) initially
- Firefox support as secondary priority
- Content scripts for platform-specific features
- Background service worker for API communication

---

## 10. File Storage Strategy

### V1 Storage (Convex)

**Supported Types:**
- Text (unlimited)
- Links (unlimited)
- Images only (JPG, PNG, GIF, WebP)

**Limits:**
- 10MB per image
- 100MB total storage per free user account

**Implementation:**
- Convex file storage API
- `storage.generateUploadUrl()` for uploads
- Store file reference in sync items
- Convex handles: storage + auth + database

### V2 Migration (UploadThing)

**Trigger:** V2 development phase

**Changes:**
- All file types supported (with security checks)
- Complete migration from Convex storage to UploadThing
- Convex becomes pure auth + metadata database
- No more file storage in Convex

**Migration Process:**
1. Add UploadThing SDK to API layer
2. Implement dual-write temporarily (both systems)
3. Background job to migrate existing files
4. Update all references to use UploadThing URLs
5. Remove Convex storage code

**Benefits:**
- Better CDN
- Image transformations
- Higher limits
- More file type support

### Self-Hosting Storage
Users provide their own UploadThing token in developer options. Their files stored in their UploadThing account.

---

## 11. Testing Strategy

### High Priority (Must Test)

**Encryption/Decryption Logic:**
- Unit tests using Vitest
- Test encryption consistency
- Test key derivation
- Test edge cases
- Cannot afford bugs here

**API Endpoints:**
- Smoke tests using Hono's built-in testing
- Verify 200 responses for valid requests
- Verify 401 for auth failures
- Verify 400 for bad input
- Test pagination and filtering

**Critical Convex Functions:**
- Test mutations that affect storage limits
- Test auth-related functions
- Use Convex test utilities

### Medium Priority (Should Test)

**CLI Integration Tests:**
- Use Go's native testing package
- Test command parsing
- Test API communication
- Test config management

### Low Priority (V2)

The following are deferred to V2:
- E2E tests (Playwright)
- Visual regression tests
- Component tests
- Load testing
- Mobile UI tests

### Testing Philosophy
Write tests for expensive-to-debug features (encryption, auth). Manual testing acceptable for UI and basic CRUD operations in V1. Increase coverage in V2 based on real-world usage patterns.

---

## 12. Deployment & Infrastructure

### Domain Strategy
- **Primary domain:** `syncnsync.com`
- **API subdomain:** `api.syncnsync.com`
- **Marketing:** `syncnsync.com`
- **App:** `app.syncnsync.com` or `syncnsync.com/dashboard`

### Hosting Breakdown

**Web Dashboard:**
- Platform: Vercel
- Auto-deploy from main branch
- Environment variables for Convex

**API Layer:**
- Platform: Vercel Serverless (Node.js)
- Auto-deploy from main branch
- Environment variables for Convex, Sentry, Axiom

**Convex:**
- Platform: Convex Cloud
- Separate deployments for dev/staging/prod

**Mobile Apps:**
- iOS: App Store
- Android: Google Play Store
- Beta testing via TestFlight and Google Play Internal Testing

**CLI Distribution:**
- GitHub Releases: Pre-built binaries for Linux, macOS, Windows
- npm: Global package installation
- Install script: `curl https://install.syncnsync.com | bash`

### CI/CD Pipeline (GitHub Actions)

**On Pull Request:**
- Lint all code (ESLint, Go linters)
- Run unit tests
- Build all packages
- Preview deployment on Vercel

**On Push to Main:**
- Run full test suite
- Build production artifacts
- Deploy web to Vercel
- Deploy API to Vercel
- Build and upload CLI binaries to GitHub Releases
- Publish npm package (if version changed)

**Manual Workflows:**
- Mobile app builds (trigger manually for releases)
- Database migrations (manual approval required)

### Environment Variables

**Managed via Vercel:**
- `CONVEX_URL`
- `CONVEX_DEPLOY_KEY`
- `SENTRY_DSN`
- `AXIOM_TOKEN`
- `UPLOADTHING_SECRET` (V2)

**Local Development:**
- `.env.local` files (gitignored)
- Separate Convex deployment for development

### Monitoring & Observability

**Error Tracking:**
- Sentry for web and API errors
- Client-side error boundaries
- API error middleware

**Logging:**
- Axiom for structured logging
- Request/response logging
- Performance metrics

**Uptime Monitoring:**
- UptimeRobot (free tier for hobby project)
- Monitor web, API, and Convex endpoints
- Email/SMS alerts on downtime

**Analytics:**
- TBD (possibly self-hosted Plausible or similar)
- Privacy-focused, no user tracking

---

## 13. Roadmap & Future Features

### V1 Target (2 months)
**Core functionality:**
- Web dashboard (marketing page, dashboard, auth, settings)
- API layer (Hono with OpenAPI)
- Mobile app (React Native with Expo)
- CLI client (Go with Cobra)
- Text, links, and images support
- Convex storage (100MB free tier)
- Basic encryption
- Push notifications (mobile)
- Self-hosting support (developer options)

### V2 Features
**User Experience:**
- Folders and favorites
- Dark mode (requires Figma design)
- File drag-and-drop upload
- Public use-once links (share text snippets)
- Markdown rendering
- Code syntax highlighting

**Platform Expansion:**
- Browser extension (Chrome/Edge)
  - Right-click context menu
  - Platform scrapers (IG, Twitter, Bluesky, Google Drive)
- Share sheet integration (mobile)
- Biometric authentication (mobile)

**Infrastructure:**
- UploadThing migration (all file types)
- Rate limiting (Arcjet)
- Advanced security checks for file uploads
- Enhanced encryption options

### V3 Ideas (Future)
- OCR for images
- File conversion using FOSS products like [vert.sh](https://vert.sh)
- Advanced collaboration features
- Integration APIs (Zapier, webhooks)
- Desktop apps (Electron/Tauri)

### Monetization (Always FOSS)
- Free tier: Text, links, images (100MB)
- Paid tier: Higher storage limits, bandwidth
- Self-hosting: Always free, users manage their own costs
- No premium features locked behind paywall
- Fully open source (MIT/Apache 2.0 license TBD)

### Timeline
- **Month 1:** Web dashboard + API + Core infrastructure
- **Month 2:** Mobile app + CLI + Polish + Documentation
- **Launch:** Soft launch with developer community
- **Post-launch:** Gather feedback, iterate on V2 features

---

## Project Structure

```
nsync/
├── apps/
│   ├── web/                 # SvelteKit dashboard
│   ├── api/                 # Hono API layer
│   ├── mobile/              # React Native (Expo)
│   └── cli/                 # Go CLI (yass)
├── packages/
│   ├── convex/              # Convex backend functions
│   ├── shared-types/        # TypeScript types
│   └── ui/                  # Shared Svelte components (if needed)
├── docs/                    # 2000s fangirl diary documentation
├── .github/
│   └── workflows/           # CI/CD pipelines
└── scripts/
    ├── install.sh           # CLI installation script
    └── migrate-to-ut.ts     # V2 migration script
```

---

## Development Workflow

### Local Development Setup
1. Clone monorepo
2. Install dependencies: `pnpm install`
3. Set up Convex: `npx convex dev`
4. Start web: `pnpm --filter web dev`
5. Start API: `pnpm --filter api dev`
6. Mobile: `pnpm --filter mobile start`
7. CLI: `cd apps/cli && go run main.go`

### Branch Strategy
- `main` - production-ready code
- `develop` - integration branch
- `feature/*` - feature branches
- `fix/*` - bug fix branches

### Commit Convention
Conventional commits for automated changelog generation:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `test:` - Test additions/changes

---

## Success Metrics

### V1 Launch Goals
- Successfully deploy all four clients (web, mobile, CLI, API)
- Self-hosting documentation complete
- At least 10 personal use items synced daily
- Zero data loss incidents
- Basic encryption working correctly

### V2 Goals
- Browser extension adoption
- UploadThing migration complete
- Community contributions (first PR merged)
- 100+ GitHub stars
- Self-hosting guide followed by at least 5 people

### Long-term Vision
- Become a reference implementation for Convex-powered sync
- Establish as go-to FOSS alternative to proprietary sync services
- Active community of contributors
- Sustainable hobby project that remains free and open

---

## Notes and Reminders

- Keep scope tight for V1 - resist feature creep
- Documentation is part of the product (2000s aesthetic)
- Self-hosting is a key differentiator
- Encryption research is critical - don't rush it
- YOLO testing philosophy, but test the important stuff
- Open source from day one, build in public
- Have fun with it - it's an unseriously serious project

---

**Last Updated:** November 25, 2025
**Status:** Planning Phase
**Timeline:** 2 months to V1 launch