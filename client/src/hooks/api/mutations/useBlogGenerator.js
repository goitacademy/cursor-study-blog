import { parse } from 'marked'
import { blogApi } from '../../../api'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useBlogGenerator() {
  const { mutate, loading, error } = useApiMutation()

  const generateContent = async (prompt) => {
    if (!prompt || !prompt.trim()) {
      return { success: false, message: 'Title required' }
    }

    const result = await mutate(
      () => blogApi.generate(prompt),
      {
        successMessage: 'Content generated successfully!',
        errorMessage: MESSAGES.ERROR_GENERIC
      }
    )

    if (result.success) {
      const rawContent = result.data?.content || ''
      const content = rawContent.trim().startsWith('<') ? rawContent : parse(rawContent)
      return { success: true, content }
    }

    return result
  }

  return {
    generateContent,
    isGenerating: loading,
    inProgress: loading,
    error
  }
}
