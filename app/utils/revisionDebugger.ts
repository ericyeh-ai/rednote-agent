/**
 * Debug utility to display revision history in console
 * Useful for monitoring draft edits before AI integration
 */

import { DraftRevision, getRevisionStats } from "./draftRevisionTracking";

/**
 * Log revision history to console in a readable format
 */
export function logRevisionHistory(revisions: DraftRevision[]): void {
  if (revisions.length === 0) {
    console.log("📝 No revisions yet");
    return;
  }

  console.log(`\n📝 Draft Revision History (${revisions.length} edits)\n`);
  console.table(
    revisions.map((r) => ({
      Time: new Date(r.timestamp).toLocaleTimeString(),
      Type: r.changeType.toUpperCase(),
      Delta: r.charDelta > 0 ? `+${r.charDelta}` : String(r.charDelta),
      Summary: r.diffSummary,
    }))
  );

  const stats = getRevisionStats(revisions);
  console.log("\n📊 Statistics:");
  console.table(stats);
}

/**
 * Get a formatted summary of recent revisions
 */
export function getRevisionSummary(
  revisions: DraftRevision[],
  limit: number = 3
): string {
  if (revisions.length === 0) {
    return "尚未編輯";
  }

  const recent = revisions.slice(-limit);
  return recent
    .map((r) => `${r.diffSummary} (${new Date(r.timestamp).toLocaleTimeString()})`)
    .join(" → ");
}

/**
 * Export revisions as JSON for inspection
 */
export function exportRevisions(revisions: DraftRevision[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      totalRevisions: revisions.length,
      revisions: revisions.map((r) => ({
        ...r,
        timestamp: new Date(r.timestamp).toISOString(),
      })),
    },
    null,
    2
  );
}

/**
 * Find the largest change in the revision history
 */
export function getLargestChange(revisions: DraftRevision[]): DraftRevision | null {
  if (revisions.length === 0) return null;
  return revisions.reduce((max, current) =>
    Math.abs(current.charDelta) > Math.abs(max.charDelta) ? current : max
  );
}

/**
 * Get the draft state at a specific point in time
 */
export function getDraftAtRevision(
  revisions: DraftRevision[],
  revisionIndex: number
): string | null {
  if (revisionIndex < 0 || revisionIndex >= revisions.length) {
    return null;
  }
  return revisions[revisionIndex].currentContent;
}
