CREATE SCHEMA "flowcrm";
--> statement-breakpoint
CREATE TABLE "flowcrm"."contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flowcrm"."deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"contact_id" integer NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"stage" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flowcrm"."deals" ADD CONSTRAINT "deals_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "flowcrm"."contacts"("id") ON DELETE no action ON UPDATE no action;