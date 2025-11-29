export const API_ENDPOINTS = {
  // Blog endpoints
  BLOGS_ALL: '/api/blog/all',
  BLOG_BY_ID: (id) => `/api/blog/${id}`,
  BLOG_CREATE: '/api/blog',
  BLOG_UPDATE: (id) => `/api/blog/${id}`,
  BLOG_DELETE: (id) => `/api/blog/${id}`,
  BLOG_PUBLISH: '/api/blog/publish',
  BLOG_UNPUBLISH: '/api/blog/unpublish',
  
  // Comment endpoints
  COMMENTS_BY_BLOG: '/api/blog/comments',
  COMMENT_ADD: '/api/blog/add-comment',
  COMMENT_DELETE: '/api/admin/delete-comment',
  COMMENT_APPROVE: '/api/admin/approve-comment',
  COMMENT_UNAPPROVE: '/api/admin/unapprove-comment',
  
  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_BLOGS: '/api/admin/blogs',
  ADMIN_COMMENTS: '/api/admin/comments'
}

