import { useState } from 'react'
import { parse } from 'marked'
import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../constants/messages'

export function useBlogGenerator() {
  const [generatedContent, setGeneratedContent] = useState(null)
  const { axios } = useAppContext()
  const { mutate, loading, error } = useApiMutation()

  const generateContent = async (input) => {
    const blogDraft = typeof input === 'string' ? { title: input } : (input || {})
    const promptTitle = blogDraft?.title

    if (!promptTitle || !promptTitle.trim()) {
      toast.error('Please enter a title')
      return { success: false, message: 'Title required' }
    }

    const result = await mutate(
      () => axios.post('/api/blog/generate', { blogDraft }),
      {
        successMessage: 'Content generated successfully!',
        errorMessage: MESSAGES.ERROR_GENERIC
      }
    )

    if (!result.success) return result

    const parsedContent = parse(result.data.content || '')
    setGeneratedContent(parsedContent)

    return { success: true, content: parsedContent }
  }

  const clearContent = () => {
    setGeneratedContent(null)
  }

  return {
    generateContent,
    clearContent,
    generatedContent,
    isGenerating: loading,
    inProgress: loading,
    error
  }
}

