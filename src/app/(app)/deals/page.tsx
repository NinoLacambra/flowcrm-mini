import { db } from "@/db";
import { contacts, deals } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DealForm } from "@/components/deals/deal-form";
import { DealTable } from "@/components/deals/deal-table";

export default async function DealsPage() {
  const contactData = await db
    .select({
      id: contacts.id,
      name: contacts.name,
    })
    .from(contacts)
    .orderBy(contacts.name);

  const dealData = await db
    .select({
      id: deals.id,
      title: deals.title,
      value: deals.value,
      stage: deals.stage,
      contactName: contacts.name,
      company: contacts.company,
    })
    .from(deals)
    .innerJoin(
      contacts,
      eq(deals.contactId, contacts.id)
    )
    .orderBy(desc(deals.createdAt));

  return (
    <div>
      <div>
        <p className="text-sm text-zinc-500">
          Opportunities
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Deals
        </h2>

        <p className="mt-2 text-zinc-400">
          Manage sales opportunities and their
          pipeline stages.
        </p>
      </div>

      <div className="mt-8">
        <DealForm contacts={contactData} />
      </div>

      <div className="mt-8">
        <DealTable deals={dealData} />
      </div>
    </div>
  );
}