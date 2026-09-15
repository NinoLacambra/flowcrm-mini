# FlowCRM Mini

A lightweight full-stack CRM and sales pipeline application built with Next.js, PostgreSQL, Supabase Auth, and Drizzle ORM.

FlowCRM Mini demonstrates a practical customer relationship management workflow — from managing contacts and deals to tracking activity and moving opportunities through a drag-and-drop sales pipeline.

## Live Demo

https://flowcrm-mini.netlify.app/

## Features

### Dashboard

- Total contact overview
- Active deal tracking
- Won deal tracking
- Active pipeline value
- Recent CRM activity

### Contact Management

- Create contacts
- Edit contact information
- Delete contacts
- Search and manage customer records
- Track contact-related activity

### Deal Management

- Create sales opportunities
- Associate deals with contacts
- Track deal values
- Manage deal stages
- Delete deals
- Record deal activity

### Sales Pipeline

Deals move through a visual sales pipeline:

```text
New
  ↓
Qualified
  ↓
Proposal
  ↓
Won / Lost
```

The pipeline supports drag-and-drop stage changes with updates persisted to PostgreSQL.

### Activity Tracking

Important CRM actions are recorded in an activity timeline, including changes to contacts, deals, and pipeline stages.

### Authentication

- Supabase Auth
- Email/password authentication
- Protected application routes
- Authenticated API access
- Secure logout flow

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Supabase
- Supabase Auth
- Drizzle ORM
- Zod
- dnd-kit
- Lucide React
- Netlify

## Architecture

```text
User
 │
 ▼
Supabase Auth
 │
 ▼
Next.js Application
 │
 ├── Dashboard
 │
 ├── Contacts
 │
 ├── Deals
 │
 └── Sales Pipeline
 │
 ▼
Next.js API Routes
 │
 ├── Validation
 ├── CRM operations
 └── Activity logging
 │
 ▼
Drizzle ORM
 │
 ▼
PostgreSQL / Supabase
```

## Database

FlowCRM Mini uses PostgreSQL hosted on Supabase.

Application tables are isolated inside the `flowcrm` PostgreSQL schema.

```text
flowcrm
├── contacts
├── deals
└── activity
```

Drizzle migration history is stored separately:

```text
drizzle_flowcrm
└── __drizzle_migrations
```

This architecture allows multiple portfolio applications to share one Supabase PostgreSQL project while keeping their application data and migration histories isolated.

## Contact Model

Contacts contain customer information such as:

```text
Name
Email
Phone
Company
Created At
```

Contacts can be associated with sales opportunities through deals.

## Deal Model

Deals represent opportunities in the sales pipeline.

Each deal contains information such as:

```text
Title
Contact
Value
Stage
Created At
```

Supported pipeline stages include:

```text
new
qualified
proposal
won
lost
```

## Pipeline Workflow

A newly created opportunity starts in the pipeline and can be moved between stages through the drag-and-drop interface.

```text
Create Deal
    │
    ▼
   New
    │
    ▼
Qualified
    │
    ▼
 Proposal
   /   \
  ▼     ▼
 Won   Lost
```

When a deal changes stage, the application persists the new stage to PostgreSQL and records the action in the CRM activity history.

## Activity Logging

FlowCRM includes an activity logging layer for recording meaningful CRM events.

This provides a historical timeline of changes instead of only storing the application's current state.

Example events include:

```text
Contact created
Contact updated
Deal created
Deal updated
Pipeline stage changed
```

## Authentication

FlowCRM Mini uses Supabase Auth for user authentication.

Authenticated users can access the CRM application while unauthenticated visitors are redirected to the login flow.

Authentication is validated server-side for protected application functionality.

## Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Never commit real database credentials, Supabase keys, or other secrets.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Database Migrations

Generate Drizzle migrations:

```bash
npx drizzle-kit generate
```

Apply migrations:

```bash
npx drizzle-kit migrate
```

## Production Build

```bash
npm run build
```

## Deployment

FlowCRM Mini is deployed on Netlify with Supabase providing PostgreSQL and authentication services.

## Project Purpose

FlowCRM Mini was built as a portfolio project to demonstrate practical full-stack SaaS development, including:

- relational database design
- CRUD operations
- authentication
- server-side authorization
- API development
- schema validation
- activity logging
- drag-and-drop interactions
- sales pipeline state management
- responsive frontend development
- production deployment

## Author

Niño C. Lacambra

Full-Stack Engineer