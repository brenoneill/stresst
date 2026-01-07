import type { IconProps } from "./types";

/**
 * Buggr logo icon - a cute bug/caterpillar made of 3 stacked rounded shapes.
 * Inspired by Caterpie from Pokemon with a simple outline style.
 * Uses stroke="currentColor" to inherit text color from parent.
 *
 * @param className - Tailwind classes for styling
 * @param ariaLabel - Accessibility label (optional)
 */
export function BuggrIcon({ className = "h-5 w-5", ariaLabel }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    >
      {/* Head - small circle at top with antennae */}
      <circle cx="12" cy="5" r="2.5" />
      {/* Left antenna */}
      <path d="M10 3.5 L8 1.5" />
      {/* Right antenna */}
      <path d="M14 3.5 L16 1.5" />
      
      {/* Middle body segment - medium ellipse */}
      <ellipse cx="12" cy="11" rx="3.5" ry="3" />
      
      {/* Bottom/rear segment - larger ellipse */}
      <ellipse cx="12" cy="18.5" rx="4.5" ry="3.5" />
    </svg>
  );
}

