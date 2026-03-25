/**
 * Mock AI Suggestion Engine
 *
 * Rules-based system that analyzes draft changes and generates contextual suggestions.
 * This is frontend-only and can be replaced with real API later.
 */

interface DraftAnalysis {
  length: number;
  hasRecommendations: boolean;
  toneIndicators: string[];
  emotionalWords: string[];
  strongVerbs: string[];
}

interface SuggesterContext {
  previousDraft: string;
  currentDraft: string;
  analysis: DraftAnalysis;
}

export interface MockAISuggestion {
  id: string;
  type: "tone" | "completeness" | "engagement" | "consistency";
  title: string;
  message: string;
  suggestedAction: string;
  confidence: number; // 0-100
  autoApplyFix?: string; // Optional auto-fix text
}

// ─── Draft Analysis ──────────────────────────────────────────────────────────

function analyzeDraft(draft: string): DraftAnalysis {
  const toneIndicators = {
    casual: ["哈", "超", "根本", "完全", "讚", "😭", "🙌"],
    formal: ["推薦", "建議", "特別", "非常", "值得"],
    emotional: ["喜歡", "愛", "驚艷", "療癒", "感動"],
  };

  const emotionalWords = Object.values(toneIndicators)
    .flat()
    .filter((word) => draft.includes(word));

  const recommendationPatterns = [
    /必吃/,
    /推薦/,
    /一定要/,
    /強烈/,
    /不能錯過/,
    /絕對/,
  ];
  const hasRecommendations = recommendationPatterns.some((p) =>
    p.test(draft)
  );

  const strongVerbs = [
    "驚艷",
    "讚",
    "愛",
    "療癒",
    "感動",
    "完虐",
    "秒殺",
  ].filter((v) => draft.includes(v));

  return {
    length: draft.length,
    hasRecommendations,
    toneIndicators: emotionalWords,
    emotionalWords,
    strongVerbs,
  };
}

// ─── Suggestion Rules ────────────────────────────────────────────────────────

function generateSuggestions(context: SuggesterContext): MockAISuggestion[] {
  const suggestions: MockAISuggestion[] = [];
  const { previousDraft, currentDraft, analysis } = context;

  // Rule 1: Detect tone shift
  const previousAnalysis = analyzeDraft(previousDraft);
  const toneShift =
    analysis.emotionalWords.length !== previousAnalysis.emotionalWords.length;

  if (toneShift && analysis.emotionalWords.length > 0) {
    suggestions.push({
      id: `tone_${Date.now()}`,
      type: "tone",
      title: "偵測到語氣變化",
      message: `我注意到你的語氣變得更${analysis.toneIndicators.includes("超") ? "輕鬆" : "正式"}了。要我調整整篇貼文保持一致嗎？`,
      suggestedAction: "adjustTone",
      confidence: 75,
    });
  }

  // Rule 2: Detect recommendation removal
  if (previousAnalysis.hasRecommendations && !analysis.hasRecommendations) {
    suggestions.push({
      id: `reco_${Date.now()}`,
      type: "completeness",
      title: "建議加強推薦力度",
      message:
        "我發現你移除了一些強烈的推薦詞。要不要加入「必吃」或「推薦」來加強說服力？",
      suggestedAction: "strengthenRecommendation",
      confidence: 70,
      autoApplyFix: "必吃",
    });
  }

  // Rule 3: Detect length change
  const lengthDiff = currentDraft.length - previousDraft.length;
  if (lengthDiff > 50 && currentDraft.length > 200) {
    suggestions.push({
      id: `length_${Date.now()}`,
      type: "engagement",
      title: "內容變更提示",
      message: `你新增了${lengthDiff}個字。內容更豐富了！確認這些內容都是你想要的嗎？`,
      suggestedAction: "reviewContent",
      confidence: 60,
    });
  }

  // Rule 4: Detect emoji usage shift
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
  const previousEmojis = (previousDraft.match(emojiRegex) || []).length;
  const currentEmojis = (currentDraft.match(emojiRegex) || []).length;

  if (currentEmojis === 0 && previousEmojis > 0) {
    suggestions.push({
      id: `emoji_${Date.now()}`,
      type: "engagement",
      title: "表情符號提示",
      message:
        "你移除了表情符號。在小紅書上，適當的emoji能增加吸引力。要加回一些嗎？",
      suggestedAction: "addEmoji",
      confidence: 65,
    });
  }

  // Rule 5: Detect extremely short draft
  if (currentDraft.length > 0 && currentDraft.length < 50) {
    suggestions.push({
      id: `short_${Date.now()}`,
      type: "completeness",
      title: "內容太短",
      message: `你的草稿只有${currentDraft.length}字。貼文至少要50字才夠吸引人。要展開敘述嗎？`,
      suggestedAction: "expandContent",
      confidence: 85,
    });
  }

  // Rule 6: Detect empty draft
  if (!currentDraft.trim()) {
    suggestions.push({
      id: `empty_${Date.now()}`,
      type: "completeness",
      title: "準備好了嗎？",
      message: "你的草稿是空的。準備好開始寫貼文了嗎？",
      suggestedAction: "startDraft",
      confidence: 100,
    });
  }

  return suggestions.slice(0, 2); // Limit to 2 suggestions at a time
}

// ─── Public API ──────────────────────────────────────────────────────────────

let suggestionIdCounter = 0;

export function getMockAISuggestions(
  previousDraft: string,
  currentDraft: string
): MockAISuggestion[] {
  // Only generate suggestions if draft actually changed
  if (previousDraft === currentDraft) {
    return [];
  }

  const analysis = analyzeDraft(currentDraft);
  const suggestions = generateSuggestions({
    previousDraft,
    currentDraft,
    analysis,
  });

  return suggestions;
}

/**
 * Mock auto-fix implementations
 * In real app, these would call AI API
 */
export function applyMockAutoFix(
  draft: string,
  action: string
): string {
  const fixes: Record<string, (draft: string) => string> = {
    adjustTone: (d) => {
      // Make more casual
      return d
        .replace(/推薦/g, "強烈推薦")
        .replace(/建議/g, "真的要")
        .replace(/值得/g, "一定要");
    },
    strengthenRecommendation: (d) => {
      // Add recommendation words if missing
      const lines = d.split("\n");
      const lastLine = lines[lines.length - 1];
      if (!lastLine.includes("必吃") && !lastLine.includes("推薦")) {
        lines.push(`${lastLine.includes("！") ? "" : "，"}強烈推薦！`);
      }
      return lines.join("\n");
    },
    addEmoji: (d) => {
      // Add emojis to enhance engagement
      const emojis = ["🍽️", "😭", "🙌", "❤️", "✨"];
      const sentences = d.split("。");
      return sentences
        .map(
          (s, i) =>
            s + (i < sentences.length - 1 ? emojis[i % emojis.length] + "。" : "。")
        )
        .join("");
    },
    expandContent: (d) => {
      return (
        d +
        "\n\n環境非常舒適，服務態度也很親切。整體體驗非常值得，強烈推薦給大家！"
      );
    },
  };

  return fixes[action]?.(draft) ?? draft;
}

/**
 * Get a sensible suggestion message based on draft state
 * For showing suggestions when draft hasn't changed much
 */
export function getContextualSuggestion(
  draft: string,
  lastUserAction?: string
): MockAISuggestion | null {
  if (!draft.trim()) {
    return {
      id: `ctx_${++suggestionIdCounter}`,
      type: "completeness",
      title: "歡迎回來！",
      message: "準備寫點什麼嗎？告訴我你的餐廳體驗，我幫你打磨成精彩貼文。",
      suggestedAction: "startDraft",
      confidence: 100,
    };
  }

  if (draft.length < 100) {
    return {
      id: `ctx_${++suggestionIdCounter}`,
      type: "completeness",
      title: "充實內容",
      message:
        "可以多分享一些細節嗎？比如環境、服務、味道。讀者會更感興趣！",
      suggestedAction: "expandContent",
      confidence: 75,
    };
  }

  return null;
}
