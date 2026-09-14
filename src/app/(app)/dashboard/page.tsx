import { db } from "@/db";
import { contacts, deals } from "@/db/schema";
import { count, eq, sum, and, ne } from "drizzle-orm";

export default async function DashboardPage() {
  const [contactsCountResult] = await db
    .select({ count: count() })
    .from(contacts);

  const [activeDealsResult] = await db
    .select({ count: count() })
    .from(deals)
    .where(
      and(
        ne(deals.stage, "won"),
        ne(deals.stage, "lost")
      )
    );

  const [wonDealsResult] = await db
    .select({ count: count() })
    .from(deals)
    .where(eq(deals.stage, "won"));

  const [pipelineValueResult] = await db
    .select({
      total: sum(deals.value),
    })
    .from(deals)
    .where(
      and(
        ne(deals.stage, "won"),
        ne(deals.stage, "lost")
      )
    );

  const totalContacts = contactsCountResult?.count ?? 0;
  const activeDeals = activeDealsResult?.count ?? 0;
  const wonDeals = wonDealsResult?.count ?? 0;
  const pipelineValue = Number(
    pipelineValueResult?.total ?? 0
  );

  const cards = [
    {
      label: "Total Contacts",
      value: totalContacts,
    },
    {
      label: "Active Deals",
      value: activeDeals,
    },
    {
      label: "Won Deals",
      value: wonDeals,
    },
    {
      label: "Pipeline Value",
      value: `₱${pipelineValue.toLocaleString()}`,
    },
  ];

  return (
    <div>
      <div>
        <p className="text-sm text-zinc-500">
          Overview
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Dashboard
        </h2>

        <p className="mt-2 text-zinc-400">
          Your sales pipeline at a glance.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <p className="text-sm text-zinc-500">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}