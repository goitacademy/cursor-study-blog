import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const commentApi = {
  // Get comments by blog ID
  getByBlogId: async (blogId) => {
    return await axios.post(API_ENDPOINTS.COMMENTS_BY_BLOG, { blogId })
  },

  // Add new comment
  add: async (commentData) => {
    return await axios.post(API_ENDPOINTS.COMMENT_ADD, commentData)
  },

  // Delete comment (admin)
  delete: async (id) => {
    return await axios.post(API_ENDPOINTS.COMMENT_DELETE, { id })
  },

  // Approve comment (admin)
  approve: async (id) => {
    return await axios.post(API_ENDPOINTS.COMMENT_APPROVE, { id })
  },

  // Unapprove comment (admin)
  unapprove: async (id) => {
    return await axios.post(API_ENDPOINTS.COMMENT_UNAPPROVE, { id })
  }
}
