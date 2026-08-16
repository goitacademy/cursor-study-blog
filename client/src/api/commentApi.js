import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const commentApi = {
  getByBlogId: async (blogId) => {
    return await axios.post(API_ENDPOINTS.COMMENTS_BY_BLOG, { blogId })
  },

  add: async (commentData) => {
    return await axios.post(API_ENDPOINTS.COMMENT_ADD, commentData)
  },

  delete: async (id) => {
    return await axios.post(API_ENDPOINTS.COMMENT_DELETE, { id })
  },

  approve: async (id) => {
    return await axios.post(API_ENDPOINTS.COMMENT_APPROVE, { id })
  },

  unapprove: async (id) => {
    return await axios.post(API_ENDPOINTS.COMMENT_UNAPPROVE, { id })
  }
}
