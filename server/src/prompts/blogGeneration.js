export const BLOG_PROMPT_CONFIG = {
  tone: 'friendly and conversational, like a thoughtful author sharing first-hand experience',
  length: 'around 1000 words',
  format: 'professional markdown article with a clear title, short intro, a few H2 sections, and a closing takeaway',
  audience: 'curious readers who want practical insight, not marketing copy',
  extraInstructions: [
    'Before writing, search the web for current, relevant information on this topic and weave accurate facts into the article naturally.',
    'Do not sound like AI: avoid generic openings, buzzwords, filler phrases, and rigid “In conclusion” style endings.',
    'Write as if drawing from personal experience — specific observations, small stories, and practical tips.',
    'Keep it warm and human while still sounding professional and credible.',
    'Prefer concrete examples over abstract advice. Do not invent fake statistics; only use facts supported by your search.',
  ].join(' ')
}

export function buildBlogPrompt(topic) {
  const { tone, length, format, audience, extraInstructions } = BLOG_PROMPT_CONFIG
  return [
    `Write a blog article about: ${topic.trim()}`,
    `Tone: ${tone}`,
    `Length: ${length}`,
    `Format: ${format}`,
    `Audience: ${audience}`,
    extraInstructions
  ].filter(Boolean).join('\n')
}
