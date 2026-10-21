import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { MESSAGES } from '../../../constants/messages'
import { API_ENDPOINTS } from '../../../constants/apiEndpoints'

export function useAdminComments() {
  const { axios } = useAppContext()
  
  const { data, loading, error, refetch } = useApiQuery(
    () => axios.get(API_ENDPOINTS.ADMIN_COMMENTS),
    {
      errorMessage: MESSAGES.ERROR_FETCH_COMMENTS
    }
  )

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch
  }
}

