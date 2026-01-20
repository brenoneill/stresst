"use client";

import Link from "next/link";
import type { GitHubRepo, GitHubCommit, GitHubCommitDetails, StressMetadata } from "@/lib/github";
import { formatFullDate } from "@/lib/date";
import { Button } from "@/app/components/inputs/Button";
import { EmptyState, EmptyStateIcons } from "@/app/components/EmptyState";
import { FileChangeList } from "@/app/components/commits/FileChangeList";
import { CreateBranchForm } from "@/app/components/stress/CreateBranchForm";
import { BranchSuccessCard } from "@/app/components/stress/BranchSuccessCard";
import { ScorePanel, BugReportSection } from "@/app/components/stress/ScorePanel";
import {
  GitHubIcon,
  DocumentIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  TrophyIcon,
  BuggrIcon,
  ChevronDownIcon,
  CoinIcon,
} from "@/app/components/icons";
import { LOADING_STEPS } from "@/app/components/stress/loading-steps";

interface RightPanelProps {
  // User
  userName?: string;
  userCoins?: number;
  logoutForm?: React.ReactNode;

  // Repo & Branch
  selectedRepo: GitHubRepo | null;
  selectedBranch: string | null;

  // Commit
  selectedCommit: GitHubCommit | null;
  commitDetails: GitHubCommitDetails | null;
  loadingDetails: boolean;

  // Score panel
  showScorePanel: boolean;
  setShowScorePanel: (show: boolean) => void;
  startCommit: GitHubCommit | undefined;
  completeCommit: GitHubCommit | undefined;
  canCheckScore: boolean;
  stressMetadata: StressMetadata | null;

  // Branch creation
  showCreateBranch: boolean;
  setShowCreateBranch: (show: boolean) => void;
  timestamp: string;
  branchSuffix: string;
  setBranchSuffix: (suffix: string) => void;
  stressContext: string;
  setStressContext: (context: string) => void;
  stressLevel: "low" | "medium" | "high" | "custom";
  setStressLevel: (level: "low" | "medium" | "high" | "custom") => void;
  customFilesCount: number;
  setCustomFilesCount: (count: number) => void;
  customBugCount: number;
  setCustomBugCount: (count: number) => void;
  creatingBranch: boolean;
  loadingStep: number;
  onCreateBranch: (e: React.FormEvent) => Promise<void>;
  onCancelCreateBranch: () => void;

  // Branch success
  branchSuccess: string | null;
  setBranchSuccess: (name: string | null) => void;
  onShowBranch: (branchName: string) => void;

  // Branch link
  copiedBranchLink: boolean;
  onCopyBranchLink: () => void;
}

/**
 * Right panel of the RepoBranchSelector.
 * Contains commit details, score panel, and branch creation form.
 */
export function RightPanel({
  userName,
  userCoins,
  logoutForm,
  selectedRepo,
  selectedBranch,
  selectedCommit,
  commitDetails,
  loadingDetails,
  showScorePanel,
  setShowScorePanel,
  startCommit,
  completeCommit,
  canCheckScore,
  stressMetadata,
  showCreateBranch,
  setShowCreateBranch,
  timestamp,
  branchSuffix,
  setBranchSuffix,
  stressContext,
  setStressContext,
  stressLevel,
  setStressLevel,
  customFilesCount,
  setCustomFilesCount,
  customBugCount,
  setCustomBugCount,
  creatingBranch,
  loadingStep,
  onCreateBranch,
  onCancelCreateBranch,
  branchSuccess,
  setBranchSuccess,
  onShowBranch,
  copiedBranchLink,
  onCopyBranchLink,
}: RightPanelProps) {
  return (
    <div className="flex h-full w-[60%] flex-col overflow-hidden p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-end">
        {userName && (
          <div className="flex items-center gap-4">
            {userCoins !== undefined && (
              <div className="flex items-center gap-1.5 rounded-lg border border-gh-border bg-gh-canvas-subtle px-3 py-1.5">
                <CoinIcon className="h-4 w-4 text-gh-accent" />
                <span className="text-sm font-semibold text-gh-accent">{userCoins}</span>
              </div>
            )}
            <Link
              href="/profile"
              className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-gh-canvas-subtle">
              <span className="font-semibold text-white group-hover:text-gh-accent">{userName}</span>
              <ChevronDownIcon className="h-4 w-4 -rotate-90 text-gh-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gh-accent" />
            </Link>
            <div>{logoutForm}</div>
          </div>
        )}
      </div>

      {/* Score Panel View */}
      {showScorePanel && startCommit && completeCommit ? (
        <ScorePanel
          key={`${selectedBranch}-${stressMetadata?.buggerId || "no-bugger"}`}
          startCommit={startCommit}
          completeCommit={completeCommit}
          branchName={selectedBranch || ""}
          onClose={() => setShowScorePanel(false)}
          stressMetadata={stressMetadata}
        />
      ) : loadingDetails ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gh-border border-t-gh-success" />
        </div>
      ) : selectedCommit && commitDetails ? (
        <div className="flex h-full flex-col gap-6 overflow-y-auto">
          {/* Commit Header */}
          <div className="flex items-start gap-4">
            {selectedCommit.author?.avatar_url ? (
              <img src={selectedCommit.author.avatar_url} alt={selectedCommit.author.login} className="h-12 w-12 rounded-full" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gh-border text-lg text-gh-text-muted">
                {selectedCommit.commit.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="text-lg font-semibold text-white">
                {selectedCommit.author?.login ?? selectedCommit.commit.author.name}
              </h2>
              <p className="text-sm text-gh-text-muted">{formatFullDate(selectedCommit.commit.author.date)}</p>
            </div>
          </div>

          {/* Commit Message */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <code className="rounded-md bg-gh-canvas-subtle px-2 py-1 font-mono text-xs text-gh-accent">
                {selectedCommit.sha.substring(0, 7)}
              </code>
              {commitDetails.stats && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gh-success-fg">+{commitDetails.stats.additions}</span>
                  <span className="text-gh-danger-fg">-{commitDetails.stats.deletions}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-white">{selectedCommit.commit.message.split("\n")[0]}</p>
          </div>

          {/* Task Panel - shown on buggr branches above file changes */}
          {stressMetadata?.symptoms && stressMetadata.symptoms.length > 0 && (
            <div className="flex flex-col gap-3">
              <BugReportSection symptoms={stressMetadata.symptoms} />
            </div>
          )}

          {/* Changed Files */}
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-gh-text-muted">
              <DocumentIcon className="h-4 w-4" />
              {commitDetails.files?.length ?? 0} files changed
            </h3>

            <FileChangeList files={commitDetails.files ?? []} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {selectedRepo && !showCreateBranch && (
              <a
                href={`https://github.com/${selectedRepo.full_name}/commit/${selectedCommit.sha}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gh-border bg-gh-border-muted px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gh-border">
                <GitHubIcon className="h-4 w-4" />
                View on GitHub
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            )}

            {selectedBranch && selectedBranch.includes("buggr-") && !showCreateBranch && (
              <Button variant="secondary" onClick={onCopyBranchLink} title="Copy branch link to share">
                {copiedBranchLink ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    Copy branch link
                  </>
                )}
              </Button>
            )}

            {selectedBranch && selectedBranch.includes("buggr-") && !showCreateBranch && (
              <div className="group relative">
                <Button
                  variant={canCheckScore ? "primary" : "secondary"}
                  onClick={() => setShowScorePanel(!showScorePanel)}
                  disabled={!canCheckScore}
                  className={!canCheckScore ? "cursor-not-allowed opacity-50" : ""}>
                  <TrophyIcon className="h-4 w-4" />
                  {showScorePanel ? "Hide Score" : "Check Score"}
                </Button>
                {/* Tooltip for disabled state */}
                {!canCheckScore && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-gh-border bg-[#1c2128] p-3 text-xs opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                    <p className="mb-1.5 font-semibold text-white">How to check your score:</p>
                    <ol className="list-inside list-decimal space-y-1 text-[11px] text-gh-text-muted">
                      <li>
                        Commit with <code className="text-gh-accent">start</code> when you begin
                      </li>
                      <li>
                        Commit with <code className="text-gh-accent">complete</code> when done
                      </li>
                    </ol>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-[#1c2128]" />
                  </div>
                )}
              </div>
            )}

            {!showCreateBranch && (
              <Button
                variant="danger"
                onClick={() => {
                  setShowCreateBranch(true);
                }}>
                <BuggrIcon className="h-4 w-4" />
                Bugger up this commit
              </Button>
            )}
          </div>

          {/* Create Branch Form */}
          {showCreateBranch && selectedBranch && (
            <CreateBranchForm
              baseBranch={selectedBranch}
              timestamp={timestamp}
              branchSuffix={branchSuffix}
              onBranchSuffixChange={setBranchSuffix}
              stressContext={stressContext}
              onStressContextChange={setStressContext}
              stressLevel={stressLevel}
              onStressLevelChange={setStressLevel}
              customFilesCount={customFilesCount}
              onCustomFilesCountChange={setCustomFilesCount}
              customBugCount={customBugCount}
              onCustomBugCountChange={setCustomBugCount}
              maxFilesAvailable={commitDetails?.files?.filter((f) => f.status !== "removed").length || 0}
              userCoins={userCoins}
              isLoading={creatingBranch}
              loadingStep={loadingStep}
              loadingSteps={LOADING_STEPS}
              onSubmit={onCreateBranch}
              onCancel={onCancelCreateBranch}
            />
          )}

          {/* Branch Success Message */}
          {branchSuccess && (
            <BranchSuccessCard
              branchName={branchSuccess}
              onDismiss={() => setBranchSuccess(null)}
              onShowBranch={() => {
                onShowBranch(branchSuccess);
                setBranchSuccess(null);
              }}
            />
          )}
        </div>
      ) : selectedCommit ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gh-border border-t-gh-success" />
        </div>
      ) : (
        <EmptyState icon={EmptyStateIcons.commits} title="No commit selected" description="Select a commit from the list to view changed files" />
      )}
    </div>
  );
}
