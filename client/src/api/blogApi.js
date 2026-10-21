import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const blogApi = {
  getAll: async () => {
    return await axios.get(API_ENDPOINTS.BLOGS_ALL)
  },

  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.BLOG_BY_ID(id))
  },

  create: async (formData) => {
    return await axios.post(API_ENDPOINTS.BLOG_CREATE, formData)
  },

  deleteBlog: async (id) => {
    return await axios.post(API_ENDPOINTS.BLOG_DELETE, { id })
  },

  publish: async (id) => {
    return await axios.post(API_ENDPOINTS.BLOG_PUBLISH, { id })
  },

  unpublish: async (id) => {
    return await axios.post(API_ENDPOINTS.BLOG_UNPUBLISH, { id })
  },

  generate: async (prompt) => {
    return await axios.post(API_ENDPOINTS.BLOG_GENERATE, { prompt })
  }
}
