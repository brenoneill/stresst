import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/notifications/[id]
 * 
 * Marks a notification as read.
 * 
 * Body:
 *   - type: "note" | "changes" | "both"
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find user by email to get the ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { id } = await params;
  const body = await request.json();
  const type = body.type || "both";

  // Verify the bugger belongs to the user
  const bugger = await prisma.bugger.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!bugger) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (bugger.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Update read status based on type
  const updateData: { noteRead?: boolean; changesRead?: boolean } = {};
  if (type === "note" || type === "both") {
    updateData.noteRead = true;
  }
  if (type === "changes" || type === "both") {
    updateData.changesRead = true;
  }

  const updated = await prisma.bugger.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      noteRead: true,
      changesRead: true,
    },
  });

  return NextResponse.json(updated);
}
