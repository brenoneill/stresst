import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * User data returned from the API.
 */
export interface UserResponse {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  gitProvider: string | null;
  gitUsername: string | null;
  gitProfileUrl: string | null;
  createdAt: string;
  // Stats
  stats: {
    totalBuggers: number;
    completedBuggers: number;
  };
}

/**
 * GET /api/user
 * 
 * Fetches the current authenticated user's profile and stats.
 * 
 * @returns The user's profile data with stats
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Find the user with their buggers and results
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        buggers: {
          include: {
            result: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalBuggers = user.buggers.length;
    const completedBuggers = user.buggers.filter(b => b.result !== null).length;

    const response: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      gitProvider: user.gitProvider,
      gitUsername: user.gitUsername,
      gitProfileUrl: user.gitProfileUrl,
      createdAt: user.createdAt.toISOString(),
      stats: {
        totalBuggers,
        completedBuggers,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[User] Error fetching user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch user" },
      { status: 500 }
    );
  }
}

