# Architecture: MomoPi

## Project Goal

**MomoPi** is a co-writing companion for Xiaohongshu food creators. Momo helps writers craft better posts, but **the human stays in control at all times**.

This is **not** a one-click generator. Instead, think of it as a thoughtful colleague who:
- Watches what you write
- Notices areas for improvement
- Offers one specific suggestion at a time
- Accepts your feedback (you can reject any idea)
- Never overwrites your work without your approval

The draft is always the source of truth. The AI suggests, the human decides.

## Current Architecture Overview

The app uses a modern React pattern: **View → State → Actions**

```
┌─────────────────────────────────────────────────────┐
│                  View Layer                         │
│  (MaterialsPanel | ChatPanel | DraftPanel)         │
│                                                     │
│  Components render from state + dispatch actions   │
└─────────────────────────────────────────────────────┘
                         ↓ ↑
┌─────────────────────────────────────────────────────┐
│                State Layer                          │
│  (useMaterialsState, useChatState, useDraftState)  │
│                                                     │
│  Custom hooks manage local state + persistence    │
└─────────────────────────────────────────────────────┘
                         ↓ ↑
┌─────────────────────────────────────────────────────┐
│              Action + Logic Layer                   │
│  (Utils: mockAiSuggestions, draftRevisionTracking) │
│                                                     │
│  Rules, suggestion engine, revision tracking      │
└─────────────────────────────────────────────────────┘
                         ↓ ↑
┌─────────────────────────────────────────────────────┐
│           Persistence Layer                         │
│  (localStorage API)                                 │
│                                                     │
│  All state persists across page reloads           │
└─────────────────────────────────────────────────────┘
```

### View Layer

Three panels form the user interface:

1. **Materials Panel** (Left)
   - Restaurant name, location, dishes, notes
   - User's context for the AI
   - Simple form inputs, real-time save

2. **Chat Panel** (Middle)
   - Conversation with the copilot
   - User asks questions or sends context
   - AI responds with suggestions or clarifications
   - Reactions/actions tied to suggestions

3. **Draft Panel** (Right)
   - The actual post being written
   - Full text editor, user-controlled
   - Real-time suggestion display
   - Apply/dismiss buttons for suggestions
   - Revision history view

### State Layer

Four main state domains, each with its own custom hook:

| Hook | Manages | Persists To |
|------|---------|-------------|
| `useMaterialsState()` | Restaurant context, dishes, notes | `momopi_materials` |
| `useChatState()` | Message history, user↔Momo conversation | `momopi_messages` |
| `useDraftState()` | Current draft text, suggestions, revisions | `momopi_draft`, `momopi_revisions` |
| `useLocalStorage()` | Generic key-value persistence | `localStorage` |

Each hook:
- Initializes state from localStorage
- Provides handlers for updates
- Auto-saves on every change (debounced where needed)
- No external dependencies (Context API free, hooks only)

### Action + Logic Layer

**Utils layer** contains the brains:

- **mockAiSuggestions.ts**
  - 6 detection rules (tone, recommendations, length, emoji, empty, etc.)
  - Generates suggestions based on draft changes
  - Returns: `{ type, title, message, suggestedAction, confidence }`

- **draftRevisionTracking.ts**
  - Detects what changed (addition, deletion, modification)
  - Creates revision records with metadata
  - Enables undo/navigation through edit history

- **ai.ts**
  - Mock LLM responses (currently rule-based)
  - Context-aware replies based on materials + chat
  - Placeholder for real API integration

### Persistence Layer

**localStorage only** (no backend yet):
- Keys namespaced with `momopi_*` prefix
- JSON serialization for complex objects
- Automatic hydration on app load
- Survives refreshes and browser closes

## Core Data Model

### Materials
```typescript
interface Materials {
  restaurant: string;    // "小红书火锅"
  location: string;      // "北京市朝阳区"
  dishes: string;        // "招牌麻辣牛肉, 鸡蛋豆腐"
  notes: string;         // "环境很不错，服务员很热情"
}
```
Source of truth about the user's subject. Everything else is derivative.

### Draft
```typescript
interface DraftState {
  draft: string;                    // Current post text
  previousDraft: string;            // For change detection
  autoSuggestions: AutoSuggestion[]; // Generated suggestions
  revisions: DraftRevision[];       // Edit history
}
```
The **user owns this**. AI only suggests improvements.

### Chat Messages
```typescript
interface Message {
  id: number;                      // Unique timestamp-based ID
  role: "user" | "ai";            // Who wrote it
  text: string;                    // Full message text
  timestamp: number;               // When sent
}
```
Conversation history. AI context comes from materials + recent messages.

### Suggestions
```typescript
interface AutoSuggestion {
  id: string;                      // Unique ID for tracking
  type: string;                    // "tone_shift", "add_recommendation", etc.
  title: string;                   // "语气变化" (human readable)
  message: string;                 // Explanation
  suggestedAction: string;        // Action name for auto-fix
  confidence: number;              // 0-100, for prioritization
  appliedAt?: number;             // When user applied it
}
```
Non-destructive. User chooses to apply or dismiss.

### Revisions
```typescript
interface DraftRevision {
  id: string;
  timestamp: number;
  changeType: "add" | "delete" | "modify";  // Type of change
  position: number;                          // Where it happened
  oldText: string;                           // Before
  newText: string;                           // After
  metadata: {
    triggerType?: string;  // "user_edit", "suggestion_accepted"
    suggestionId?: string; // Which suggestion caused this (if any)
  };
}
```
Complete audit trail. Enables undo, transparency, debugging.

### User Preferences
```typescript
interface UserPreferences {
  theme?: "light" | "dark";
  fontSize?: number;
  autoSaveInterval?: number;
  // Future additions: tone preference, emoji style, etc.
}
```
Currently minimal. Will grow with user settings.

## AI Integration Plan

### Current State: Mock Workflow
- Rule-based suggestion engine (no API calls)
- Simulated user → AI → suggestion flow
- Good for testing UX before real LLM

### Phase 2: Real LLM Integration
When we add a real language model (Claude, GPT, etc.):

**What the LLM will do:**
1. **Understand edits** - "You just deleted the emoji, should we add more descriptive words instead?"
2. **Ask follow-ups** - "This dish sounds great, but you didn't mention the price. Should we add that?"
3. **Generate suggestions** - "Here's a more engaging opening sentence..."
4. **Rewrite selectively** - "Let me improve just this paragraph..."

**LLM behavior constraints:**
- Never modifies the draft directly
- Always explains its reasoning
- Respects confidence levels (only high-confidence suggestions bubble up)
- References materials + draft context (no hallucinations)
- One suggestion at a time (not overwhelming)

**How the draft stays authoritative:**
```
User edits draft
       ↓
App detects change
       ↓
LLM analyzes: "What could improve here?"
       ↓
LLM returns suggestion (not a rewrite)
       ↓
User sees suggestion, decides: Apply / Dismiss
       ↓
If Apply: draft updates, revision recorded
If Dismiss: suggestion discarded, draft unchanged
```

### Integration Points
- **Backend API** (future): POST `/api/suggest` with `{ materials, draft, lastEdit }`
- **Response format**: Same `AutoSuggestion` interface (so UI doesn't change)
- **Error handling**: Degrade gracefully to mock suggestions if API fails
- **Cost control**: Cache suggestions, batch requests, use confidence thresholds

## Why Single-Agent Architecture (Not Multi-Agent)

At v1, we use **one copilot**, not multiple specialized agents.

### Why not multiple agents?
Multi-agent systems (one for tone, one for SEO, one for emotions) sound powerful but have real costs:

1. **Maintainability** - More agents = more orchestration code, more failure modes
2. **Evaluation** - Hard to understand which agent is wrong when something breaks
3. **Cost** - Each agent = more API calls, higher bills
4. **User confusion** - Conflicting suggestions from different agents ("Tone agent says be casual, SEO agent says be formal")
5. **Debugging** - If quality drops, you don't know which agent changed

### Single-agent advantage
One well-trained copilot can:
- Make holistic decisions (tone + SEO + emotion all at once)
- Explain reasoning in one narrative
- Fail clearly (if output is bad, there's one place to look)
- Learn from all feedback (not siloed in sub-agents)
- Cost less (one API call instead of three)

Future: If we need deep specialization (image tagging, audio analysis), we can add tools/MCP. But the core copilot stays 1:1 with the user.

## How Markdown Rules and Skill Docs Fit In

We use markdown files in three ways:

### 1. Documentation (for humans)
- `.md` files that explain how features work
- Examples: `QUICK_START.md`, `CONTRIBUTING.md`, `DEPLOYMENT.md`
- Audience: developers, contributors
- Purpose: knowledge transfer

### 2. AI Behavior Rules (for the LLM)
- Markdown files that encode product rules
- Examples: `SUGGESTION_RULES_GUIDE.md` (what kinds of suggestions to make)
- Format: Natural language rules with examples
- Audience: LLM system prompt (future integration)
- Purpose: "When you see X, suggest Y"

### 3. Product Policy (decisions + rationale)
- `ARCHITECTURE.md` (this file) - high-level decisions
- `ROADMAP.md` - product direction
- `AGENTS.md` - how agents/tools should behave (if added)
- Audience: product team, future implementers
- Purpose: "Why we chose this approach"

### Integration with real LLM
When we add Claude/GPT:
```
App sends: { materials, draft, lastEdit }
       ↓
System prompt includes:
  - SUGGESTION_RULES_GUIDE.md (→ "what to suggest")
  - Engineering principles (→ "how to behave")
  - Examples (→ "tone of voice")
       ↓
LLM generates suggestion
       ↓
App validates against known rules
       ↓
Response format matches AutoSuggestion interface
```

## Engineering Principles

These guide every decision:

### 1. Human Stays in Control
- No auto-apply (always ask)
- User reads every suggestion before it's applied
- Explicit dismiss/accept (no silent ignoring)
- Draft is never overwritten without approval

### 2. Suggestions Over Autonomy
- AI proposes, human disposes
- One suggestion at a time (not overwhelming)
- Clear reasoning (why this suggestion?)
- Easy to reject without friction

### 3. No Hallucinated Details
- Everything grounds in materials or visible context
- No inventing facts about the restaurant/food
- If unsure, ask user instead of guessing
- Confidence scores are real, not padded

### 4. Prefer Simple Architecture First
- Use localStorage before adding a database
- Use hooks before adding state libraries
- Use rules before adding ML models
- Add complexity only when necessary

### 5. Evaluate Success Clearly
- Metrics: Does user accept suggestions? Do they feel helpful?
- Not: How many suggestions generated? (vanity metric)
- A/B test changes (different rules, different tone)
- User feedback loop (comments, dismissals, revisions)

### 6. Transparent Reasoning
- Show *why* we're making a suggestion
- Link suggestions to materials ("Because you didn't mention the price...")
- Show confidence level
- Make it easy to understand our logic

## Architecture Layers: Detailed View

### View → State → Action Flow Example
User edits draft paragraph:

```
1. User types in DraftPanel
   ↓
2. handleDraftChange fires
   ↓
3. setDraft() updates state (useDraftState)
   ↓
4. useEffect detects change
   ↓
5. Debounced suggestion generation
   ↓
6. mockAiSuggestions.generateSuggestions() runs
   ↓
7. Returns [ { type: "tone_shift", ... } ]
   ↓
8. setAutoSuggestions() updates state
   ↓
9. DraftPanel re-renders with bubble
   ↓
10. User sees: "语气变化 - 你的语气变得更正式了"
    User clicks: [采纳] [忽略]
   ↓
11. handleApplySuggestion() or handleIgnoreSuggestion()
   ↓
12. If applied: draft updates, revision recorded
   ↓
13. localStorage auto-saves (via hook effect)
```

No prop drilling, no Redux, no context factory. Just hooks and updates.

## Data Flow: High Level

```
Materials
    ↓
    ├─→ [Passed to AI when user chats]
    └─→ [Grounds suggestions] ("You haven't mentioned price")
    
User ↔ AI Chat
    ├─→ [Materials context used for context]
    ├─→ [Draft can be extracted from responses]
    └─→ [Conversation stored, shown below suggestions]

Draft Text (SOURCE OF TRUTH)
    ├─→ [Change detected]
    ├─→ [Suggestions generated based on change]
    ├─→ [Suggestions stored in state]
    ├─→ [User applies/dismisses]
    └─→ [Revisions recorded]

Revisions
    ├─→ [Audit trail]
    ├─→ [Undo capability]
    └─→ [Analysis (what types of edits do users make?)]
```

## Future Architecture Evolution

### v1 (Current)
- Frontend only, mock workflow
- localStorage persistence
- Rule-based suggestion engine
- Single-panel chat + three-panel editing
- Focus: UX validation, user feedback

### v2 (Real LLM Integration)
- Add simple backend (just API routes)
- Claude/GPT integration via REST
- Real suggestion generation
- Caching layer to reduce API calls
- Focus: Quality of suggestions, cost control

### v3 (Memory + Multimodal)
- User can save past posts as examples
- "Learn from my best posts" feature
- Image understanding (food photos)
- Automatic hashtag/caption generation
- Publishing automation (draft → clipboard/Xiaohongshu API)
- Focus: Workflow speed, platform integration

### v4 (Tools + Extensibility)
- MCP (Model Context Protocol) support
- Tools: HTML/markdown converter, SEO checker, etc.
- Multi-language support
- Publish to TikTok/Instagram/Xiaohongshu
- Collaborations (share drafts with friends)
- Focus: Platform agnostic, code maintainability

**Key point**: Each phase is self-contained. v2 doesn't require v3. v3/v4 are optional.

## NOT in Our Architecture: What We Avoided

### ❌ Multi-Agent Systems
- Reason: Complexity vs. benefit tradeoff (see Single-Agent section)
- Alternative: Tools/skill system (MCP layer, v4+)

### ❌ Complex State Management
- Reason: Hooks + localStorage sufficient for current scope
- When we'd add: If state becomes >10 domains or shared between 5+ pages
- If added: Use Zustand (not Redux, too heavy)

### ❌ Database Early
- Reason: MVP doesn't need sync, users accept localStorage
- When we'd add: At v2 when we need cloud sync, user history, analytics
- If added: Start with simple SQL + REST, consider supabase for speed

### ❌ Real-Time Multiplayer
- Reason: Not a core requirement for v1
- Future: Yes, at v3 (collaborative editing)
- Tech debt: Current architecture extends easily (add OT/CRDT library)

## Current Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| View Layer | ✅ Complete | 3 panels, real-time updates |
| State Hooks | ✅ Complete | 4 hooks, localStorage sync |
| Mock Suggestion Engine | ✅ Complete | 6 rules, working well |
| Revision Tracking | ✅ Complete | Full audit trail |
| Chat Interface | ✅ Complete | IME support (Chinese input) |
| Type Safety | ✅ Complete | Full TypeScript coverage |
| Persistence | ✅ Complete | Survival across reloads |
| Real LLM Integration | ⏳ Planned | v2, API endpoints ready |
| User Accounts | ⏳ Planned | v2, auth layer |
| Cloud Sync | ⏳ Planned | v3, state replication |

## Current Recommended Next Step

### From an architecture perspective:

**Build a simple Node.js API layer** that:
1. Accepts POST `/api/suggest` with `{ materials, draft, recentMessages }`
2. Calls Claude/GPT with your suggestion rules
3. Returns back the same `AutoSuggestion` JSON format
4. Includes basic caching (Redis or in-memory) to reduce API calls

**Why this step?**
- Validates that real LLM can match or beat rule-based suggestions
- Tests cost (is $10/month or $100/month?)
- Gives you real user data to evaluate (do users accept LLM suggestions more/less?)
- Doesn't require database or user accounts (can test with localhost)
- Decouples from any specific LLM (can swap Claude ↔ GPT later)
- Teaches you exactly where the slowness is

**Not recommended yet:**
- ❌ User accounts (you don't need auth for v1→v2 testing)
- ❌ Database (localStorage fine until v3)
- ❌ Multi-agent system (still not needed)
- ❌ Publish integrations (first get suggestion quality right)

Once real LLM works well, decide: push v2 to production, or build v3 features first?

---

**See also:**
- [ROADMAP.md](./ROADMAP.md) - Product timeline and phases
- [SUGGESTION_RULES_GUIDE.md](./docs/SUGGESTION_RULES_GUIDE.md) - How suggestion engine works
- [QUICK_START.md](./docs/QUICK_START.md) - Running the app locally
