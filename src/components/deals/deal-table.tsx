"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

type Deal = {
  id: number;
  title: string;
  value: string;
  stage: string;
  contactName: string;
  company: string | null;
};

export function DealTable({
  deals,
}: {
  deals: Deal[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number, title: string) {
    const confirmed = window.confirm(
      `Delete "${title}"?`
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch(`/api/deals?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Failed to delete deal"
        );
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete deal"
      );
    } finally {
      setDeletingId(null);
    }
  }

  function formatStage(stage: string) {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      {deals.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-zinc-500">
            No deals yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-5 py-4 font-medium">
                  Deal
                </th>

                <th className="px-5 py-4 font-medium">
                  Contact
                </th>

                <th className="px-5 py-4 font-medium">
                  Company
                </th>

                <th className="px-5 py-4 font-medium">
                  Stage
                </th>

                <th className="px-5 py-4 font-medium">
                  Value
                </th>

                <th className="px-5 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  className="border-b border-zinc-800 last:border-b-0"
                >
                  <td className="px-5 py-4 font-medium text-zinc-200">
                    {deal.title}
                  </td>

                  <td className="px-5 py-4 text-zinc-400">
                    {deal.contactName}
                  </td>

                  <td className="px-5 py-4 text-zinc-400">
                    {deal.company || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-zinc-400">
                      {formatStage(deal.stage)}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-zinc-200">
                    ₱
                    {Number(
                      deal.value
                    ).toLocaleString()}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        handleDelete(
                          deal.id,
                          deal.title
                        )
                      }
                      disabled={deletingId === deal.id}
                      title="Delete deal"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 transition hover:bg-red-950/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}