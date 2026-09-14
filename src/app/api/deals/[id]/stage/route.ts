import { NextResponse } from "next/server";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { logActivity } from "@/lib/activity";
import { requireUser } from "@/lib/auth";

const stageSchema = z.object({
  stage: z.enum([
    "new",
    "qualified",
    "proposal",
    "won",
    "lost",
  ]),
});

function formatStage(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const dealId = Number(id);

    if (!dealId || Number.isNaN(dealId)) {
      return NextResponse.json(
        { message: "Invalid deal ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const result = stageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid stage" },
        { status: 400 }
      );
    }

    const [existingDeal] = await db
      .select()
      .from(deals)
      .where(eq(deals.id, dealId));

    if (!existingDeal) {
      return NextResponse.json(
        { message: "Deal not found" },
        { status: 404 }
      );
    }

    if (existingDeal.stage === result.data.stage) {
      return NextResponse.json(existingDeal);
    }

    const [updatedDeal] = await db
      .update(deals)
      .set({
        stage: result.data.stage,
      })
      .where(eq(deals.id, dealId))
      .returning();

    await logActivity({
      type: "deal_stage_changed",
      message: `Moved ${updatedDeal.title} from ${formatStage(
        existingDeal.stage
      )} → ${formatStage(updatedDeal.stage)}`,
      entityType: "deal",
      entityId: updatedDeal.id,
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error("PATCH deal stage error:", error);

    return NextResponse.json(
      { message: "Failed to update deal stage" },
      { status: 500 }
    );
  }
}