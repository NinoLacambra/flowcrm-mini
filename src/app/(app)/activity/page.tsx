import { db } from "@/db";
import { activities } from "@/db/schema";
import { desc } from "drizzle-orm";
import {
  UserPlus,
  Handshake,
  ArrowRightLeft,
  Trash2,
  Activity as ActivityIcon,
} from "lucide-react";

function getActivityIcon(type: string) {
  switch (type) {
    case "contact_created":
      return UserPlus;

    case "deal_created":
      return Handshake;

    case "deal_stage_changed":
      return ArrowRightLeft;

    case "contact_deleted":
    case "deal_deleted":
      return Trash2;

    default:
      return ActivityIcon;
  }
}

function formatActivityType(type: string) {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function ActivityPage() {
  const data = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.createdAt));

  return (
    <div>
      <div>
        <p className="text-sm text-zinc-500">History</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Activity
        </h2>

        <p className="mt-2 text-zinc-400">
          Recent actions across your CRM workspace.
        </p>
      </div>

      <div className="mt-8">
        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-10 text-center">
            <ActivityIcon
              size={28}
              className="mx-auto text-zinc-600"
            />

            <p className="mt-4 font-medium text-zinc-300">
              No activity yet
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              CRM actions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            {data.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);

              return (
                <div
                  key={activity.id}
                  className={`flex gap-4 p-5 ${
                    index !== data.length - 1
                      ? "border-b border-zinc-800"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
                    <Icon
                      size={18}
                      className="text-zinc-400"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium text-zinc-200">
                        {activity.message}
                      </p>

                      <time className="shrink-0 text-xs text-zinc-600">
                        {activity.createdAt.toLocaleString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-zinc-500">
                        {formatActivityType(activity.type)}
                      </span>

                      {activity.entityType && (
                        <span className="text-xs text-zinc-600">
                          {activity.entityType}
                          {activity.entityId
                            ? ` #${activity.entityId}`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}