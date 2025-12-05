"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  /**
   * Icon to display (SVG element or component).
   */
  icon: ReactNode;
  /**
   * Main title text.
   */
  title: string;
  /**
   * Optional description text below the title.
   */
  description?: string;
  /**
   * Size variant for the empty state.
   * @default "default"
   */
  size?: "sm" | "default";
}

/**
 * A reusable empty state component for displaying when no data is available.
 *
 * @param icon - Icon element to display
 * @param title - Main heading text
 * @param description - Optional subtext
 * @param size - Size variant (sm for inline, default for centered)
 */
export function EmptyState({ icon, title, description, size = "default" }: EmptyStateProps) {
  if (size === "sm") {
    return (
      <div className="rounded-lg border border-gh-border bg-gh-canvas-subtle px-4 py-3 text-sm text-gh-text-muted">
        {title}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gh-border bg-gh-canvas-subtle">
        <div className="h-8 w-8 text-gh-text-muted">{icon}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        {description && <p className="text-xs text-gh-text-muted">{description}</p>}
      </div>
    </div>
  );
}

/**
 * Common icons for empty states.
 */
export const EmptyStateIcons = {
  commits: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-full w-full">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  bugReports: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-full w-full">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  search: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-full w-full">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
};

