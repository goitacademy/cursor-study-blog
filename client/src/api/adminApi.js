import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const adminApi = {
  login: async (credentials) => {
    return await axios.post(API_ENDPOINTS.ADMIN_LOGIN, credentials)
  },

  getDashboard: async () => {
    return await axios.get(API_ENDPOINTS.ADMIN_DASHBOARD)
  },

  getBlogs: async () => {
    return await axios.get(API_ENDPOINTS.ADMIN_BLOGS)
  },

  getComments: async () => {
    return await axios.get(API_ENDPOINTS.ADMIN_COMMENTS)
  }
}
