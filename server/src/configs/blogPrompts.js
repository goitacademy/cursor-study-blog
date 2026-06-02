const sanitizeField = (value) => {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

export function buildBlogGenerationPrompt(blogDraft = {}, mode = 'fullArticle') {
  const title = sanitizeField(blogDraft.title)
  const subTitle = sanitizeField(blogDraft.subTitle)
  const category = sanitizeField(blogDraft.category)

  const safeMode = sanitizeField(mode) || 'fullArticle'

  const topicLine = title ? `Title: ${title}` : 'Title: (not provided)'
  const subtitleLine = subTitle ? `Subtitle: ${subTitle}` : 'Subtitle: (not provided)'
  const categoryLine = category ? `Category: ${category}` : 'Category: (not provided)'

  const lengthHint =
    safeMode === 'outline'
      ? 'Return a concise outline with headings only.'
      : 'Return a complete article with an intro, multiple sections, and a conclusion.'

  return [
    'You are a professional blog writer for StudySprint.',
    'Write in clear, simple language for general readers.',
    categoryLine,
    topicLine,
    subtitleLine,
    '',
    'Formatting requirements (strict):',
    '- Output ONLY valid Markdown (no HTML, no code fences).',
    '- Use Markdown headings with `##` for sections.',
    '- Include at least one numbered list and at least one bullet list.',
    '- Always end with `## Conclusion`.',
    lengthHint,
    '',
    'Do not include explanations or meta commentary—return only the article Markdown.'
  ].join('\n')
}

