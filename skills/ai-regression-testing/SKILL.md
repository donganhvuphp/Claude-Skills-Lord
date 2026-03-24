---
name: ai-regression-testing
description: Regression testing strategies for AI-assisted development. Catches the blind spots where the same model writes and reviews code — sandbox/production path parity, API response shape contracts, optimistic update rollback.
---

> Pairs with: tdd-workflow, testing, verification-loop

# AI Regression Testing

## When to Activate

- An AI agent (Claude Code, Cursor, Codex) modified API routes or backend logic
- A bug was found and fixed — need to prevent re-introduction
- Project has a sandbox/mock mode that bypasses database dependencies
- Running a bug-check workflow after AI-driven code changes

## The Core Problem

When an AI writes code and reviews its own work, it carries the same blind spots into both steps:

```
AI writes fix → AI reviews fix → AI says "looks correct" → Bug still exists
```

**Real pattern observed across 4 regressions on the same endpoint:**
- Fix 1: Added field to API response → forgot the SELECT query
- Fix 2: Added to SELECT → TypeScript build error (types not updated)
- Fix 3: Fixed production path → forgot sandbox path
- Fix 4: Test caught it instantly ✅

The pattern: **sandbox/production path inconsistency** is the #1 AI-introduced regression.

## Test Setup (Vitest + Next.js App Router)

```typescript
// __tests__/setup.ts — force sandbox mode, no database needed
process.env.SANDBOX_MODE = "true";
process.env.NEXT_PUBLIC_SUPABASE_URL = "";
```

```typescript
// __tests__/helpers.ts
export function createTestRequest(url: string, options?: {
  method?: string; body?: Record<string, unknown>; sandboxUserId?: string;
}): NextRequest {
  const { method = "GET", body, sandboxUserId } = options || {};
  const headers: Record<string, string> = {};
  if (sandboxUserId) headers["x-sandbox-user-id"] = sandboxUserId;
  if (body) { headers["content-type"] = "application/json"; }
  return new NextRequest(`http://localhost:3000${url}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
}
```

## The 4 AI Regression Patterns

### Pattern 1: Sandbox/Production Path Mismatch 🔴 High

```typescript
// ❌ Field added to production path only
if (isSandboxMode()) return { data: { id, email } };  // missing new field
return { data: { id, email, notification_settings } };

// ✅ Both paths return the same shape
if (isSandboxMode()) return { data: { id, email, notification_settings: null } };
return { data: { id, email, notification_settings } };
```

**Test:** Assert all required fields in sandbox mode (forced by test setup).

### Pattern 2: SELECT Clause Omission 🔴 High

```typescript
// ❌ New column in response but missing from SELECT
const { data } = await supabase.from("users").select("id, email").single();
return { data: { ...data, notification_settings: data.notification_settings } };
// → always undefined

// ✅ Use SELECT * or explicitly add column
const { data } = await supabase.from("users").select("*").single();
```

### Pattern 3: Error State Leakage 🟡 Medium

```typescript
// ❌ Error set but stale data not cleared
catch (err) { setError("Failed"); }  // previous tab data still showing

// ✅ Clear related state on error
catch (err) { setItems([]); setError("Failed"); }
```

### Pattern 4: Optimistic Update Without Rollback 🟡 Medium

```typescript
// ❌ UI updated but API can fail silently
setItems(prev => prev.filter(i => i.id !== id));
await fetch(`/api/items/${id}`, { method: "DELETE" });

// ✅ Capture previous state, rollback on failure
const prevItems = [...items];
setItems(prev => prev.filter(i => i.id !== id));
try {
  const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error();
} catch { setItems(prevItems); }
```

## Writing Regression Tests

**Key principle:** Write tests for bugs that were found, not for code that works.

```typescript
// Name the test after the bug it prevents
const REQUIRED_FIELDS = ["id", "email", "notification_settings"]; // added after bug

it("notification_settings is not undefined (BUG-R1 regression)", async () => {
  const res = await GET(createTestRequest("/api/user/profile"));
  const { json } = await parseResponse(res);
  expect("notification_settings" in json.data).toBe(true);
});
```

## Bug-Check Workflow

```
1. npm run test      → Fail = highest priority bug, stop here
2. npm run build     → Fail = type error, stop here
3. AI code review    → Focus on the 4 patterns above
4. For each fix      → Write a regression test before fixing
```

## Quick Reference

| AI Regression Pattern | Priority | Test Strategy |
|---|---|---|
| Sandbox/production mismatch | 🔴 High | Assert same response shape in sandbox mode |
| SELECT clause omission | 🔴 High | Assert all required fields in response |
| Error state leakage | 🟡 Medium | Assert state cleanup on error |
| Missing rollback | 🟡 Medium | Assert state restored on API failure |
