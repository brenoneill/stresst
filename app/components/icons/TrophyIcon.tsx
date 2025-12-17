import type { IconProps } from "./types";

/**
 * Trophy icon for scores/achievements.
 * Uses fill="currentColor" to inherit text color from parent.
 *
 * @param className - Tailwind classes for styling
 * @param ariaLabel - Accessibility label (optional)
 */
export function TrophyIcon({ className = "h-5 w-5", ariaLabel }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

