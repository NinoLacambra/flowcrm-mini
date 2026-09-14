"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Contact = {
  id: number;
  name: string;
};

export function DealForm({
  contacts,
}: {
  contacts: Contact[];
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "new",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create deal");
        return;
      }

      setForm({
        title: "",
        contactId: "",
        value: "",
        stage: "new",
      });

      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
    >
      <h3 className="text-lg font-semibold">Add Deal</h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Deal title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />

        <select
          value={form.contactId}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contactId: e.target.value,
            }))
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        >
          <option value="">Select contact</option>

          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Deal value"
          value={form.value}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />

        <select
          value={form.stage}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              stage: e.target.value,
            }))
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        >
          <option value="new">New</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Add Deal"}
      </button>
    </form>
  );
}