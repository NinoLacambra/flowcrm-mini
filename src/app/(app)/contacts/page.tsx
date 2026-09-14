import { db } from "@/db";
import { contacts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ContactForm } from "@/components/contacts/contact-form";
import { ContactTable } from "@/components/contacts/contact-table";

export default async function ContactsPage() {
  const data = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt));

  return (
    <div>
      <div>
        <p className="text-sm text-zinc-500">
          Customers & leads
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Contacts
        </h2>

        <p className="mt-2 text-zinc-400">
          Manage the people in your sales pipeline.
        </p>
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>

      <ContactTable contacts={data} />
      
    </div>
  );
}