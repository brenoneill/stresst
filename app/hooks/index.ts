/**
 * React Query hooks for data fetching.
 * All hooks that interact with the Neon database are exported from here.
 */

// User hooks
export { useUser, useUserCache, userQueryKey } from "./useUser";

// Bugger & Result hooks
export {
  useBuggers,
  useResultByBugger,
  useResults,
  useSaveResult,
  buggerKeys,
  resultKeys,
  type Bugger,
  type Result,
  type ResultByBuggerResponse,
} from "./useBuggers";

// Other hooks
export { useDashboardUrl } from "./useDashboardUrl";

