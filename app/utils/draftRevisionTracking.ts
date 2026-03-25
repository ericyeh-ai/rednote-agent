/**
 * Draft Revision Tracking System
 * Tracks user edits to prepare for future AI suggestions
 */

export type ChangeType = "add" | "delete" | "modify";

export interface DraftRevision {
  id: string;
  timestamp: number;
  previousContent: string;
  currentContent: string;
  changeType: ChangeType;
  charDelta: number; // character count difference
  diffSummary: string; // human-readable description
}

/**
 * Detect the type of change between previous and current draft
 */
export function detectChangeType(
  previous: string,
  current: string
): ChangeType {
  const prevTrimmed = previous.trim();
  const currTrimmed = current.trim();

  // No change
  if (prevTrimmed === currTrimmed) {
    return "modify";
  }

  // Content added
  if (currTrimmed.length > prevTrimmed.length) {
    return "add";
  }

  // Content deleted
  if (currTrimmed.length < prevTrimmed.length) {
    return "delete";
  }

  // Default to modify
  return "modify";
}

/**
 * Generate a human-readable summary of the change
 */
export function generateDiffSummary(
  previous: string,
  current: string,
  changeType: ChangeType
): string {
  const prevLen = previous.trim().length;
  const currLen = current.trim().length;
  const delta = currLen - prevLen;

  switch (changeType) {
    case "add":
      return `添加 ${Math.abs(delta)} 字`;
    case "delete":
      return `刪除 ${Math.abs(delta)} 字`;
    case "modify":
      return currLen === prevLen
        ? "內容調整"
        : `調整 ${Math.abs(delta)} 字`;
    default:
      return "編輯";
  }
}

/**
 * Create a new revision entry
 */
export function createRevision(
  previousContent: string,
  currentContent: string
): DraftRevision {
  const changeType = detectChangeType(previousContent, currentContent);
  const diffSummary = generateDiffSummary(previousContent, currentContent, changeType);
  const charDelta = currentContent.trim().length - previousContent.trim().length;

  return {
    id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    previousContent,
    currentContent,
    changeType,
    charDelta,
    diffSummary,
  };
}

/**
 * Get recent revisions (for UI display)
 */
export function getRecentRevisions(
  revisions: DraftRevision[],
  limit: number = 5
): DraftRevision[] {
  return revisions.slice(-limit).reverse();
}

/**
 * Get change statistics from revision history
 */
export function getRevisionStats(revisions: DraftRevision[]) {
  return {
    totalEdits: revisions.length,
    additions: revisions.filter((r) => r.changeType === "add").length,
    deletions: revisions.filter((r) => r.changeType === "delete").length,
    modifications: revisions.filter((r) => r.changeType === "modify").length,
    totalCharAdded: revisions
      .filter((r) => r.changeType === "add")
      .reduce((sum, r) => sum + r.charDelta, 0),
    totalCharRemoved: revisions
      .filter((r) => r.changeType === "delete")
      .reduce((sum, r) => sum + Math.abs(r.charDelta), 0),
  };
}
