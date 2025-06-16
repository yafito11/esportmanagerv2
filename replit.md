# Esport Manager: The Codebreaker

## Overview

Esport Manager: The Codebreaker is a comprehensive esports team management simulation game focused on tactical FPS games (similar to Valorant). The application combines a full-stack web architecture with 3D visualization capabilities, allowing users to manage teams, players, tournaments, and matches while providing an immersive strategic gaming experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **3D Graphics**: React Three Fiber ecosystem (@react-three/fiber, @react-three/drei, @react-three/postprocessing) for immersive 3D match visualization
- **UI Components**: Radix UI primitives with custom styling for consistent, accessible interface
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **State Management**: Zustand for lightweight, efficient state management across multiple stores
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API services
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database
- **Authentication**: Session-based authentication with secure password handling
- **Development**: Hot module replacement via Vite integration for seamless development experience

### Build System
- **Bundling**: Vite for frontend, ESBuild for backend production builds
- **TypeScript**: Full TypeScript support across frontend, backend, and shared schemas
- **Asset Management**: Support for 3D models (GLTF/GLB), audio files, and GLSL shaders
- **Deployment**: Configured for Replit autoscale deployment with proper build steps

## Key Components

### Team Management System
- **Player Management**: Comprehensive player database with stats, contracts, and availability tracking
- **Team Composition**: Role-based team building (Duelist, Initiator, Controller, Sentinel, Flex)
- **Staff Management**: Coaches, analysts, and support staff with specializations
- **Financial Management**: Budget tracking, salary management, and market value calculations

### Match Simulation Engine
- **Agent Drafting**: Strategic agent selection system with role-based constraints
- **3D Match Visualization**: Real-time 3D match rendering with player movements and tactical overlays
- **Statistical Analysis**: Detailed match statistics, player performance metrics, and team analytics
- **Map System**: Multiple competitive maps with callouts, tactical positions, and strategic analysis

### Tournament System
- **Tournament Management**: Multiple tournament formats with bracket generation
- **Scheduling**: Automated match scheduling with conflict resolution
- **Results Tracking**: Comprehensive match results with round-by-round analysis
- **Prize Pools**: Tournament rewards and ranking systems

### AI Integration
- **Strategic Advice**: AI-powered tactical recommendations and analysis
- **Draft Assistance**: Intelligent agent selection suggestions based on team composition
- **Performance Analysis**: Automated insights on player and team performance
- **Market Intelligence**: Transfer market analysis and player valuation

## Data Flow

### User Authentication Flow
1. User registration/login through Express.js API endpoints
2. Session management with secure password validation
3. Game state initialization with user-specific data
4. Frontend state synchronization via Zustand stores

### Match Simulation Flow
1. Tournament scheduling creates matches in PostgreSQL
2. Draft phase with real-time agent selection validation
3. 3D match simulation with React Three Fiber rendering
4. Statistical calculation and database persistence
5. Results propagation to tournament brackets and rankings

### Team Management Flow
1. Player database queries with availability filtering
2. Contract negotiations with budget validation
3. Team composition analysis with role requirements
4. Performance tracking with historical data analysis

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, React Router, React Hook Form for frontend functionality
- **3D Graphics**: Three.js ecosystem for 3D rendering and animations
- **Database**: Drizzle ORM with PostgreSQL driver for type-safe database operations
- **UI Framework**: Radix UI primitives for accessible, unstyled components
- **Validation**: Zod for runtime type validation and schema generation

### Development Tools
- **TypeScript**: Full type safety across the entire application stack
- **Vite**: Modern build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **Drizzle Kit**: Database migrations and schema management
- **Connect-pg-simple**: PostgreSQL session store for Express sessions

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express.js backend
- **Hot Reloading**: Automatic frontend updates with backend integration
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Environment Variables**: Secure configuration management for database credentials

### Production Deployment
- **Build Process**: Multi-stage build with frontend optimization and backend bundling
- **Asset Optimization**: Automatic asset compression and optimization
- **Database Provisioning**: Automated PostgreSQL database setup with Neon
- **Scaling**: Replit autoscale deployment with load balancing

### Monitoring and Maintenance
- **Error Handling**: Comprehensive error boundaries and API error responses
- **Logging**: Request logging with performance metrics
- **Database Monitoring**: Connection pooling and query optimization
- **Security**: HTTPS enforcement and secure session management

## Changelog

```
Changelog:
- June 16, 2025. Initial setup
- June 16, 2025. Implemented responsive design with mobile navigation
- June 16, 2025. Migrated from OpenAI to Gemini API 2.0 Flash
- June 16, 2025. Added automatic team creation with $1M starting budget
- June 16, 2025. Fixed scout player functionality with proper API endpoints
- June 16, 2025. Added scroll areas and mobile-optimized layout
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```