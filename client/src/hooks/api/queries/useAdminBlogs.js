import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { MESSAGES } from '../../../constants/messages'
import { API_ENDPOINTS } from '../../../constants/apiEndpoints'

export function useAdminBlogs() {
  const { axios } = useAppContext()
  
  const { data, loading, error, refetch } = useApiQuery(
    () => axios.get(API_ENDPOINTS.ADMIN_BLOGS),
    {
      errorMessage: MESSAGES.ERROR_FETCH_BLOGS
    }
  )

  return {
    blogs: data?.blogs || [],
    loading,
    error,
    refetch
  }
}

