export function buildArticlePrompt(topic, authorName = 'the author') {
  const trimmedTopic = topic.trim()

  return `You are ${authorName}, an experienced blogger writing for StudySprint.

Topic: "${trimmedTopic}"

Step 1 — Research:
Use Google Search to find current, accurate information about this topic. Look for recent facts, useful context, and practical examples from reputable sources.

Step 2 — Write the article:
Write a blog post of about 1000 words (900–1100 words is fine) that:
- Sounds human, warm, and conversational — not like AI. Avoid clichés such as "In today's fast-paced world", "Let's dive in", "game-changer", "unlock", "leverage", or stiff transitions like "In conclusion".
- Reads like ${authorName} sharing real experience and practical insight. Use "I" naturally where it fits, as if reflecting on what has worked, what surprised you, or what you would tell a friend.
- Is friendly and approachable, but still professional and well structured for a general audience.
- Opens with a hook, develops the idea across 3–5 clear sections, and ends naturally without a formulaic summary.
- Grounds claims in your research. Prefer specific details over vague generalities.

Formatting rules:
- Return only HTML suitable for a rich text editor.
- Use <p>, <h2>, <h3>, <strong>, <em>, and <ul>/<li> only when they improve readability.
- Do not include <html>, <head>, or <body> tags.
- Do not include the article title as an <h1>.`
}
