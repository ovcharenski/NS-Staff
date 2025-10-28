# NS Staff Team Portfolio

## Overview

NS Staff is a creative portfolio website showcasing team members and their projects. The application presents staff profiles with unique visual elements (like polaroid photo fans), multilingual support (English/Russian), and dynamic project displays. Each staff member has personalized accent colors, contact information, and associated projects. The site emphasizes modern design aesthetics with smooth interactions and responsive layouts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing with three main routes:
- Home page (`/`) - displays all staff and projects with search functionality
- Staff detail page (`/:endpoint`) - individual staff member profiles
- Project detail page (`/projects/:endpoint`) - individual project details

**State Management**: TanStack Query (React Query) for server state management with aggressive caching strategies (staleTime: Infinity, no automatic refetching).

**UI Component System**: Radix UI primitives with shadcn/ui styling patterns using the "new-york" style preset. All components follow a consistent design system with CSS custom properties for theming.

**Styling Strategy**: 
- Tailwind CSS with custom configuration for dark mode support
- CSS variables for dynamic theming (staff-specific accent colors)
- Custom utility classes for elevation effects (`hover-elevate`, `active-elevate-2`)
- Typography system using Inter (body) and Space Grotesk (headings) from Google Fonts

**Internationalization**: i18next with react-i18next for English/Russian translations, loaded dynamically from JSON files in the public directory.

**Animation**: Framer Motion for interactive components (specifically the polaroid fan effect that spreads photos on hover).

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Development Mode**: Vite middleware integration for hot module replacement during development.

**API Structure**: RESTful endpoints serving JSON data:
- `/api/staff` - list all staff members
- `/api/staff/:endpoint` - individual staff member data
- `/api/staff/:endpoint/photo/:num` - staff photos
- `/api/staff/:endpoint/qr/:lang` - generated QR code business cards
- `/api/projects` - list all projects
- `/api/projects/:endpoint` - individual project data
- `/api/projects/:endpoint/picture` - project images
- `/locales/:lang/:ns.json` - translation files

**Data Storage**: File-based storage system with JSON files organized hierarchically:
- `data/endpoints.json` - master list of staff endpoints
- `data/projects.json` - project configuration and colors
- `data/staff/:endpoint/values.json` - staff member data
- `data/projects/values/:endpoint.json` - project data
- Photos stored in `data/staff/:endpoint/` directory
- Project images in `data/projects/pictures/`

**Caching Strategy**: In-memory caching of parsed JSON data with lazy initialization.

**Business Card Generation**: Server-side canvas rendering to generate QR code business cards with staff photos, contact information, and personalized color schemes.

### Data Schema Design

**Type Safety**: Zod schemas define and validate data structures at runtime:
- `StaffMember` - includes multilingual name/description, contacts, projects, custom colors
- `Project` - includes multilingual description, tags, developers array
- `EndpointsConfig` and `ProjectsConfig` for metadata

**Multilingual Content**: Text fields use locale keys (en-EN, ru-RU) with fallback logic.

**Color Customization**: Each staff member and project collection has color scheme objects (color1, color2, color_main) for visual theming.

### External Dependencies

**UI Framework**: 
- React 18 with TypeScript
- Radix UI component primitives (30+ packages for accessible components)
- shadcn/ui component patterns

**Build Tools**:
- Vite for development and production builds
- esbuild for server-side bundling
- PostCSS with Tailwind CSS

**Backend Services**:
- Express.js for HTTP server
- QRCode library for QR code generation
- Canvas (node-canvas) for server-side image generation

**Styling**:
- Tailwind CSS with custom configuration
- class-variance-authority for component variants
- clsx and tailwind-merge for conditional classes

**Internationalization**:
- i18next and react-i18next for translations
- country-flag-icons for flag rendering

**State Management**:
- TanStack Query for server state
- Wouter for routing

**Animation**:
- Framer Motion for interactive animations

**Utilities**:
- date-fns for date manipulation
- nanoid for unique ID generation
- Zod for runtime type validation

**Database Configuration** (prepared but not actively used):
- Drizzle ORM with PostgreSQL dialect
- @neondatabase/serverless driver
- Database schema defined in `shared/schema.ts`
- Migration configuration pointing to `./migrations` directory

Note: While Drizzle is configured, the current implementation uses file-based storage. The database setup suggests future plans for persistent data storage.