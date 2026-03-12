# Log Lesson to Dev Wiki

When the user says **"log this to my lesson site"**, extract the key lesson from the conversation and POST it to the lesson API.

## Trigger

`log this to my lesson site`

## Action

Make a POST request to the lessons API:

**URL:** `https://code-locked.vercel.app/api/lessons`
**Method:** POST
**Headers:**
- `Content-Type: application/json`
- `x-api-secret: Lessons123`

**Body** (JSON):
```json
{
  "title": "Concise title of the lesson",
  "summary": "One or two sentence summary of what was learned",
  "content": "Full markdown explanation of the concept, with ## headings, code blocks, examples",
  "category": "Category (e.g. TypeScript, React, Architecture, DevOps, Algorithms)",
  "difficulty": "beginner | intermediate | advanced",
  "tags": ["tag1", "tag2", "tag3"],
  "realWorldExample": "A concrete real-world scenario where this applies",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "conversationContext": "Brief note about what prompted this lesson"
}
```

## Instructions

1. Review the recent conversation to identify the core technical lesson
2. Extract structured information as shown above
3. POST to the API endpoint
4. Confirm success with the lesson URL: `https://code-locked.vercel.app/lessons/{id}`
