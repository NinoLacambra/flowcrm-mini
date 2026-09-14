import { db } from "@/db";
import { activities } from "@/db/schema";

type ActivityInput = {
  type: string;
  message: string;
  entityType?: string;
  entityId?: number;
};

export async function logActivity({
  type,
  message,
  entityType,
  entityId,
}: ActivityInput) {
  await db.insert(activities).values({
    type,
    message,
    entityType: entityType ?? null,
    entityId: entityId ?? null,
  });
}