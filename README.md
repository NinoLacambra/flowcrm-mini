# FlowCRM Mini

FlowCRM Mini is a lightweight full-stack CRM built to demonstrate a modern SaaS-style workflow using Next.js, Supabase, PostgreSQL, Drizzle ORM, and TypeScript.

The project includes contact management, deal tracking, a drag-and-drop sales pipeline, activity logging, authentication, and dashboard analytics.

## Features

- Supabase email/password authentication
- Protected CRM pages and API routes
- Contact management
- Deal creation and deletion
- Drag-and-drop sales pipeline
- Pipeline stages:
  - New
  - Qualified
  - Proposal
  - Won
  - Lost
- Activity history
- Dashboard metrics
- Responsive desktop and mobile navigation
- PostgreSQL database using a dedicated `flowcrm` schema
- Drizzle ORM migrations
- Zod validation

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Drizzle ORM
- Zod
- dnd-kit
- Lucide React

## Dashboard

The dashboard provides a quick view of CRM performance, including:

- Total contacts
- Active deals
- Won deals
- Active pipeline value

Active deals include deals in:

- New
- Qualified
- Proposal

Won and lost deals are excluded from the active pipeline value.

## Sales Pipeline

Deals can be moved between stages using drag-and-drop.

When a deal changes stage, the application:

1. Updates the deal in PostgreSQL.
2. Persists the new pipeline stage.
3. Records the movement in the activity history.

Example:

```text
Moved Website Redesign from Qualified → Proposal