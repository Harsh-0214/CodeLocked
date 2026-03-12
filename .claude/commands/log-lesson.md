---
description: Extracts the key technical lesson from the current conversation and posts it to code-locked.vercel.app. Use when the user says "log this to my lesson site".
allowed-tools: Bash
---

Review the entire conversation and extract a detailed technical lesson. Then use the Bash tool to POST it to the lessons API.

## Step 1 — Extract the lesson

Identify:
- The core technical concept discussed
- Every technology/library/tool used and WHY it was chosen
- What makes this worth knowing professionally (resume angle)
- What breaks without this knowledge

## Step 2 — POST via curl

Run this exact curl command with the lesson data filled in:

```bash
curl -s -X POST https://code-locked.vercel.app/api/lessons \
  -H "Content-Type: application/json" \
  -H "x-api-secret: Lessons123" \
  -d '{
    "title": "<concise specific title>",
    "summary": "<2-3 sentences: what was learned and why it matters>",
    "content": "<full markdown, 300-600 words, ## sections, code blocks>",
    "category": "<TypeScript|React|Next.js|Architecture|DevOps|Databases|Algorithms|Security>",
    "difficulty": "<beginner|intermediate|advanced>",
    "tags": ["<tag1>", "<tag2>"],
    "realWorldExample": "<concrete industry scenario, be specific>",
    "whyItMatters": "<why this matters in professional engineering>",
    "technologiesUsed": [
      {"name": "<tech>", "reason": "<why chosen over alternatives>"}
    ],
    "keyTakeaways": [
      "<specific actionable insight>",
      "<gotcha or edge case>"
    ],
    "resumeSkills": [
      {"skill": "<skill as on resume>", "why": "<why employers value this, interview angle>"}
    ],
    "conversationContext": "<one sentence about what prompted this>"
  }'
```

## Step 3 — Confirm

Parse the JSON response and print:
`✓ Lesson saved: https://code-locked.vercel.app/lessons/{id}`
