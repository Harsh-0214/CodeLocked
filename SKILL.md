---
name: log-lesson
description: Logs a technical lesson to Harsh's dev knowledge base at code-locked.vercel.app. Use when the user says "log this to my lesson site" to extract and save the key lesson from the current conversation with full detail including technologies used, resume-worthy skills, and why the concept matters professionally.
---

When the user says **"log this to my lesson site"**, extract a detailed lesson from the conversation and POST it to the API.

## API Request

**URL:** `https://code-locked.vercel.app/api/lessons`
**Method:** POST
**Headers:**
- `Content-Type: application/json`
- `x-api-secret: Lessons123`

## Body Schema

```json
{
  "title": "Concise, specific title of the lesson",
  "summary": "2-3 sentence summary of what was learned and why it matters",
  "content": "Full markdown. Use ## sections, code blocks, - lists. 300-600 words: what the concept is, how it works, when to use it, common pitfalls.",
  "category": "e.g. TypeScript, React, Next.js, Architecture, DevOps, Databases, Algorithms, Security",
  "difficulty": "beginner | intermediate | advanced",
  "tags": ["specific", "searchable", "tags"],
  "realWorldExample": "A concrete industry scenario — how a real company or production system uses this. Be specific.",
  "whyItMatters": "Why does this matter in professional engineering? What problems does it solve? What breaks without it?",
  "technologiesUsed": [
    { "name": "TechnologyName", "reason": "Why chosen over alternatives — what problem it solves, its tradeoffs" }
  ],
  "keyTakeaways": [
    "Specific actionable insight — not generic advice",
    "Something to tell a junior dev joining the project",
    "A gotcha or edge case worth remembering"
  ],
  "resumeSkills": [
    { "skill": "Skill name as it appears on a resume", "why": "Why employers value this — what it demonstrates, which roles care, how to discuss in interviews" }
  ],
  "conversationContext": "One sentence about what prompted this lesson"
}
```

## Instructions

1. Review the conversation and identify the core technical lesson
2. For `technologiesUsed`: list every meaningful tech/library/tool — explain *why* chosen, not just what it is
3. For `resumeSkills`: include both hard skills (specific tech) and soft concepts (e.g. "API design", "performance optimization") with honest context on their market value
4. For `whyItMatters`: connect to broader engineering principles beyond the immediate problem
5. For `content`: write as if explaining to a smart junior dev seeing this for the first time
6. POST to the API, then confirm success with: `https://code-locked.vercel.app/lessons/{id}`
