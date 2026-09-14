"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  createdAt: Date;
};

export function ContactTable({
  contacts,
}: {
  contacts: Contact[];
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredContacts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) => {
      return (
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query)
      );
    });
  }, [contacts, search]);

  async function deleteContact(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete contact");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-600"
          />
        </div>

        <p className="text-sm text-zinc-500">
          {filteredContacts.length} contact
          {filteredContacts.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {filteredContacts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  No contacts found.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="bg-zinc-900"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {contact.name}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {contact.email}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {contact.company || "—"}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {contact.phone || "—"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteContact(contact.id)}
                      disabled={deletingId === contact.id}
                      className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}