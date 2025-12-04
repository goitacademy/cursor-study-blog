export const ROUTES = {
  HOME: '/',
  BLOG_DETAIL: '/blog/:id',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ADD_BLOG: '/admin/addBlog',
  ADMIN_ARTICLES: '/admin/articles'
}

export const getBlogDetailPath = (id) => `/blog/${id}`
