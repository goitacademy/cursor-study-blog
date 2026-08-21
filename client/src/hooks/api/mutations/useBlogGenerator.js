import { parse } from 'marked'
import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../constants/messages'
import { API_ENDPOINTS } from '../../../constants/apiEndpoints'

export function useBlogGenerator() {
  const { axios } = useAppContext()
  const { mutate, loading, error } = useApiMutation()

  const generateContent = async (prompt) => {
    if (!prompt || !prompt.trim()) {
      toast.error('Please enter a title')
      return { success: false, message: 'Title required' }
    }

    const result = await mutate(
      () => axios.post(API_ENDPOINTS.BLOG_GENERATE, { prompt }),
      {
        successMessage: MESSAGES.SUCCESS_CONTENT_GENERATED,
        errorMessage: MESSAGES.ERROR_GENERIC
      }
    )

    if (result.success && result.data?.content) {
      return { success: true, content: parse(result.data.content) }
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
