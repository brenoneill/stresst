import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchCommitDetails } from "@/lib/github";

/**
 * GET /api/github/commit
 * 
 * Fetches details for a specific commit, including changed files.
 * Requires owner, repo, and sha query parameters.
 */
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const sha = searchParams.get("sha");

  if (!owner || !repo || !sha) {
    return NextResponse.json(
      { error: "Missing owner, repo, or sha parameter" },
      { status: 400 }
    );
  }

  try {
    const commitDetails = await fetchCommitDetails(session.accessToken, owner, repo, sha);
    return NextResponse.json(commitDetails);
  } catch (error) {
    console.error("Error fetching commit details:", error);
    return NextResponse.json(
      { error: "Failed to fetch commit details" },
      { status: 500 }
    );
  }
}

