export const API_ENDPOINTS = {
  // Blog endpoints
  BLOGS_ALL: '/api/blog/all',
  BLOG_BY_ID: (id) => `/api/blog/${id}`,
  BLOG_CREATE: '/api/blog/add',
  BLOG_DELETE: '/api/blog/delete',
  BLOG_PUBLISH: '/api/blog/publish',
  BLOG_UNPUBLISH: '/api/blog/unpublish',
  BLOG_GENERATE: '/api/blog/generate',

  // Comment endpoints
  COMMENTS_BY_BLOG: '/api/blog/comments',
  COMMENT_ADD: '/api/blog/add-comment',
  COMMENT_DELETE: '/api/admin/delete-comment',
  COMMENT_APPROVE: '/api/admin/approve-comment',
  COMMENT_UNAPPROVE: '/api/admin/unapprove-comment',

  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_BLOGS: '/api/admin/blogs',
  ADMIN_COMMENTS: '/api/admin/comments'
}
