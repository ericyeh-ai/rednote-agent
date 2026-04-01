import { Materials } from "../types";

// ─── ID generator ─────────────────────────────────────────────────────────────

export function getNextId(): number {
  return Date.now() * 100000 + Math.floor(Math.random() * 100000);
}

export function setMsgIdCounter(_id: number): void {
  // Deprecated: no longer needed with timestamp-based IDs
}

// ─── Momo conversation state ──────────────────────────────────────────────────

// Tracks whether Momo has already asked follow-up questions this session
// Simple in-memory flag (resets on page refresh — fine for v1 mock)
let momoAskedFollowUp = false;

export function resetMomoState(): void {
  momoAskedFollowUp = false;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasMaterials(materials: Materials): boolean {
  return !!(materials.restaurant || materials.dishes || materials.notes);
}

function firstName(materials: Materials): string {
  return materials.restaurant || "這家";
}

function topDish(materials: Materials): string {
  return materials.dishes?.split(/[,，、]/)[0]?.trim() || "招牌菜";
}

// ─── Momo voice ───────────────────────────────────────────────────────────────

/**
 * Returns a Momo-style follow-up question based on what's filled in.
 * Picks one question to avoid overwhelming the user.
 */
function momoFollowUp(materials: Materials): string {
  const dish = topDish(materials);

  const questions = [
    `${dish}你會再回購嗎？`,
    `最推薦哪個口味或品項？`,
    `有沒有踩雷的？或是什麼特別驚喜的地方？`,
    `跟朋友去還是自己去的？`,
    `環境怎麼樣？適合久坐聊天嗎？`,
  ];

  // Pick semi-randomly but deterministically based on materials length
  const idx = (materials.restaurant?.length ?? 0 + (materials.dishes?.length ?? 0)) % questions.length;
  return questions[idx];
}

function generateDraft(materials: Materials): string {
  const name = firstName(materials);
  const dish = topDish(materials);
  const loc = materials.location ? `（${materials.location}）` : "";
  const notes = materials.notes?.trim();

  const lines: string[] = [
    `${name}${loc}`,
    ``,
    notes ? notes : `第一口就知道這次來對了`,
    ``,
    `${dish}是必點的`,
    `那個口感⋯ 說真的，在外面很難找到一樣的`,
    ``,
    `我應該會再來一次`,
    `甚至可能下週就回去了 哈`,
    ``,
    `#${name.replace(/\s/g, "")} #${dish} #${materials.location || "台北美食"} #小紅書美食`,
  ];

  return lines.join("\n");
}

// ─── Main mock reply ──────────────────────────────────────────────────────────

export function mockAiReply(userText: string, materials: Materials): string {
  const name = firstName(materials);
  const dish = topDish(materials);

  // ── Draft generation ──
  if (
    userText.includes("生成") ||
    userText.includes("草稿") ||
    userText.includes("寫") ||
    userText.includes("✍️")
  ) {
    const draft = generateDraft(materials);
    momoAskedFollowUp = true;
    return `好，我先幫你起個稿\n你可以直接在右邊改，覺得哪句不對就告訴我\n\n「${draft}」`;
  }

  // ── Title suggestions ──
  if (userText.includes("標題") || userText.includes("💡")) {
    return `三個方向你選一個：\n\n1. ${name}，我應該會再來一次\n2. 說真的，${dish}在這裡吃到的是不一樣的東西\n3. 不是在推，是真的很好吃（${name}）\n\n你比較喜歡哪種感覺？偏情緒的還是偏直白的？`;
  }

  // ── Tags ──
  if (
    userText.includes("標籤") ||
    userText.includes("tag") ||
    userText.includes("🏷️")
  ) {
    const loc = materials.location || "台北";
    return `這些標籤應該蠻適合的：\n\n#${name.replace(/\s/g, "")} #${dish} #${loc}美食 #台灣美食 #小紅書美食 #值得再來 #餐廳推薦\n\n如果你的受眾比較特定（像是約會、親子、獨食）可以再加幾個垂直標籤`;
  }

  // ── Casual tone ──
  if (
    userText.includes("輕鬆") ||
    userText.includes("casual") ||
    userText.includes("🎨")
  ) {
    momoAskedFollowUp = true;
    return `好，語氣再放鬆一點\n\n「週末去了一下 ${name}\n${dish} 真的很可以，一上桌就開始動筷\n\n環境不會太吵，坐著聊了快兩小時也沒人催\n${materials.location ? materials.location + "的朋友" : "附近的朋友"}可以排進口袋名單了」\n\n這樣感覺有沒有比較像在跟朋友說話？`;
  }

  // ── First message with materials → ask follow-up questions ──
  if (hasMaterials(materials) && !momoAskedFollowUp) {
    momoAskedFollowUp = true;
    const followUp = momoFollowUp(materials);
    return `好喔，${name}我記下來了\n\n先問你一個：${followUp}`;
  }

  // ── Follow-up answer or general message ──
  if (momoAskedFollowUp && hasMaterials(materials)) {
    return `了解～\n這個細節很有用，等一下寫進草稿裡\n\n還有什麼要補充的嗎？或是直接說「生成草稿」我就先幫你起個版本`;
  }

  // ── No materials yet ──
  if (!hasMaterials(materials)) {
    return `先在左邊填一下餐廳資訊\n名字、菜色、你的感受隨便寫都可以\n填完我再幫你想怎麼寫`;
  }

  // ── Fallback ──
  return `收到\n\n你想從哪裡開始？\n• 說「生成草稿」我直接起稿\n• 說「想標題」我給你幾個方向\n• 說「推薦標籤」我幫你整理`;
}
