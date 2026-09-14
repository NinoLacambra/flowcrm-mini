import { NextResponse } from "next/server";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { logActivity } from "@/lib/activity";
import { requireUser } from "@/lib/auth";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
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
      .from(contacts)
      .orderBy(desc(contacts.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET contacts error:", error);

    return NextResponse.json(
      { message: "Failed to fetch contacts" },
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

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid contact data",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const [contact] = await db
      .insert(contacts)
      .values({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        company: result.data.company || null,
      })
      .returning();

    await logActivity({
      type: "contact_created",
      message: `Created contact: ${contact.name}`,
      entityType: "contact",
      entityId: contact.id,
    });

    return NextResponse.json(contact, {
      status: 201,
    });
  } catch (error) {
    console.error("POST contact error:", error);

    return NextResponse.json(
      { message: "Failed to create contact" },
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
        { message: "Invalid contact id" },
        { status: 400 }
      );
    }

    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id));

    if (!contact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    await db
      .delete(contacts)
      .where(eq(contacts.id, id));

    await logActivity({
      type: "contact_deleted",
      message: `Deleted contact: ${contact.name}`,
      entityType: "contact",
      entityId: contact.id,
    });

    return NextResponse.json({
      message: "Contact deleted",
    });
  } catch (error) {
    console.error("DELETE contact error:", error);

    return NextResponse.json(
      { message: "Failed to delete contact" },
      { status: 500 }
    );
  }
}