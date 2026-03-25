import { Materials } from "../types";

// ─── Mock AI response ────────────────────────────────────────────────────────

/**
 * Generate a guaranteed unique message ID
 * Uses high-precision timestamp + large random number
 */
export function getNextId(): number {
  // timestamp (ms) * 100000 + random(0-99999)
  // Ensures no collisions even within the same millisecond
  return Date.now() * 100000 + Math.floor(Math.random() * 100000);
}

export function setMsgIdCounter(id: number): void {
  // Deprecated: no longer needed with timestamp-based IDs
}

export function mockAiReply(userText: string, materials: Materials): string {
  const name = materials.restaurant || "這家餐廳";
  const loc = materials.location || "台北";
  const dish = materials.dishes?.split(/[,，、]/)[0] || "招牌菜";

  if (userText.includes("標題")) {
    return `好的！這裡有三個標題候選：\n\n1. 🔥 ${name} 讓我吃一次就上癮\n2. 在${loc}發現的寶藏小店，${dish}必點！\n3. 不誇張！${name}是我今年吃過最驚艷的一餐\n\n你喜歡哪個風格？我可以繼續調整。`;
  }
  if (userText.includes("標籤") || userText.includes("tag")) {
    return `推薦這些標籤 👇\n\n#${name} #${loc}美食 #台灣美食 #${dish} #小紅書美食 #餐廳推薦 #必吃清單\n\n可以再根據你的受眾加幾個垂直領域的標籤，例如 #約會餐廳 或 #親子友善。`;
  }
  if (userText.includes("生成") || userText.includes("草稿") || userText.includes("寫")) {
    return `這是根據你的素材生成的草稿：\n\n「去了 ${name}（${loc}），真的被驚艷到了！\n\n${materials.notes || "環境舒適，服務超好，完全不像一般餐廳。"}\n\n${dish} 是必點項目，每一口都有驚喜。整體體驗非常值得，強烈推薦給大家！🍽️」\n\n這是初稿，你想調整語氣還是加更多細節？`;
  }
  if (userText.includes("輕鬆") || userText.includes("casual")) {
    return `好，我把語氣調成更輕鬆日常的版本！\n\n「週末跑去試了 ${name}，整個人被療癒到 😭\n\n${dish} 一上桌就秒殺，完全停不下來。環境也很舒服，坐著聊天聊了快三小時都不想走。\n\n${loc}的朋友快去！下次我還要再去 🙌」\n\n這樣感覺比較像在跟朋友說話對吧？`;
  }

  return `收到！你說的「${userText.slice(0, 20)}」我記下來了。\n\n根據你目前填的素材，我可以幫你：\n• 生成完整貼文草稿\n• 想標題（可以給我喜歡的風格）\n• 推薦標籤\n• 調整語氣（輕鬆 / 推薦 / 種草）\n\n要從哪個開始？`;
}