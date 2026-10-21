import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { MESSAGES } from '../../../constants/messages'
import { API_ENDPOINTS } from '../../../constants/apiEndpoints'

const defaultDashboard = {
  blogs: 0,
  comments: 0,
  drafts: 0,
  recentBlogs: [],
  recentComments: []
}

export function useAdminDashboard() {
  const { axios } = useAppContext()
  
  const { data, loading, error, refetch } = useApiQuery(
    () => axios.get(API_ENDPOINTS.ADMIN_DASHBOARD),
    {
      errorMessage: MESSAGES.ERROR_GENERIC
    }
  )

  return {
    dashboardData: data?.dashboardData || defaultDashboard,
    loading,
    error,
    refetch
  }
}

