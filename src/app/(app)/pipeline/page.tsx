import { db } from "@/db";
import { contacts, deals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";

export default async function PipelinePage() {
  const data = await db
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
    );

  return (
    <div>
      <div>
        <p className="text-sm text-zinc-500">
          Sales pipeline
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Pipeline
        </h2>

        <p className="mt-2 text-zinc-400">
          Track opportunities as they move through your sales process.
        </p>
      </div>

      <PipelineBoard deals={data} />
    </div>
  );
}