import { NextResponse } from "next/server";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { logActivity } from "@/lib/activity";
import { requireUser } from "@/lib/auth";

const dealSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  contactId: z.number().int().positive(),
  value: z.number().positive(),
  stage: z.enum([
    "new",
    "qualified",
    "proposal",
    "won",
    "lost",
  ]),
});

export async function GET() {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const data = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET deals error:", error);

    return NextResponse.json(
      { message: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const result = dealSchema.safeParse({
      ...body,
      contactId: Number(body.contactId),
      value: Number(body.value),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid deal data",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const [deal] = await db
      .insert(deals)
      .values({
        title: result.data.title,
        contactId: result.data.contactId,
        value: result.data.value.toString(),
        stage: result.data.stage,
      })
      .returning();

    await logActivity({
      type: "deal_created",
      message: `Created deal: ${deal.title}`,
      entityType: "deal",
      entityId: deal.id,
    });

    return NextResponse.json(deal, {
      status: 201,
    });
  } catch (error) {
    console.error("POST deal error:", error);

    return NextResponse.json(
      { message: "Failed to create deal" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid deal id" },
        { status: 400 }
      );
    }

    const [deal] = await db
      .select()
      .from(deals)
      .where(eq(deals.id, id));

    if (!deal) {
      return NextResponse.json(
        { message: "Deal not found" },
        { status: 404 }
      );
    }

    await db
      .delete(deals)
      .where(eq(deals.id, id));

    await logActivity({
      type: "deal_deleted",
      message: `Deleted deal: ${deal.title}`,
      entityType: "deal",
      entityId: deal.id,
    });

    return NextResponse.json({
      message: "Deal deleted",
    });
  } catch (error) {
    console.error("DELETE deal error:", error);

    return NextResponse.json(
      { message: "Failed to delete deal" },
      { status: 500 }
    );
  }
}