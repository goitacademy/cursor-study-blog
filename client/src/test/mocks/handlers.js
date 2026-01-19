import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:5000'

// Mock blog data
const mockBlogs = [
  {
    _id: '1',
    title: 'First Test Blog',
    subTitle: 'Test Subtitle 1',
    description: '<p>First blog description</p>',
    category: 'Technology',
    image: 'https://example.com/image1.jpg',
    author: 'Test Author',
    authorImg: 'https://example.com/author.jpg',
    date: new Date('2024-01-01').toISOString(),
    isPublished: true,
  },
  {
    _id: '2',
    title: 'Second Test Blog',
    subTitle: 'Test Subtitle 2',
    description: '<p>Second blog description</p>',
    category: 'Lifestyle',
    image: 'https://example.com/image2.jpg',
    author: 'Test Author',
    authorImg: 'https://example.com/author.jpg',
    date: new Date('2024-01-02').toISOString(),
    isPublished: true,
  },
]

// Mock comments
const mockComments = [
  {
    _id: '1',
    blogId: '1',
    name: 'John Doe',
    content: 'Great article!',
    date: new Date('2024-01-01').toISOString(),
    approved: true,
  },
  {
    _id: '2',
    blogId: '1',
    name: 'Jane Smith',
    content: 'Very informative',
    date: new Date('2024-01-02').toISOString(),
    approved: false,
  },
]

export const handlers = [
  // Blog endpoints
  http.get(`${API_BASE}/api/blog/list`, () => {
    return HttpResponse.json({
      success: true,
      blogs: mockBlogs.filter(blog => blog.isPublished),
    })
  }),

  http.get(`${API_BASE}/api/blog/:id`, ({ params }) => {
    const blog = mockBlogs.find(b => b._id === params.id)
    if (blog) {
      return HttpResponse.json({
        success: true,
        blog,
      })
    }
    return HttpResponse.json(
      { success: false, message: 'Blog not found' },
      { status: 404 }
    )
  }),

  http.post(`${API_BASE}/api/blog/add`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'Blog created successfully',
      blog: { _id: '3', ...mockBlogs[0] },
    })
  }),

  http.delete(`${API_BASE}/api/blog/delete/:id`, ({ params }) => {
    const blog = mockBlogs.find(b => b._id === params.id)
    if (blog) {
      return HttpResponse.json({
        success: true,
        message: 'Blog deleted successfully',
      })
    }
    return HttpResponse.json(
      { success: false, message: 'Blog not found' },
      { status: 404 }
    )
  }),

  http.put(`${API_BASE}/api/blog/toggle-publish/:id`, ({ params }) => {
    const blog = mockBlogs.find(b => b._id === params.id)
    if (blog) {
      return HttpResponse.json({
        success: true,
        message: 'Blog status updated',
        blog: { ...blog, isPublished: !blog.isPublished },
      })
    }
    return HttpResponse.json(
      { success: false, message: 'Blog not found' },
      { status: 404 }
    )
  }),

  // Comment endpoints
  http.get(`${API_BASE}/api/comment/list/:blogId`, ({ params }) => {
    const comments = mockComments.filter(
      c => c.blogId === params.blogId && c.approved
    )
    return HttpResponse.json({
      success: true,
      comments,
    })
  }),

  http.post(`${API_BASE}/api/comment/add`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'Comment added successfully',
      comment: mockComments[0],
    })
  }),

  http.delete(`${API_BASE}/api/comment/delete/:id`, ({ params }) => {
    const comment = mockComments.find(c => c._id === params.id)
    if (comment) {
      return HttpResponse.json({
        success: true,
        message: 'Comment deleted successfully',
      })
    }
    return HttpResponse.json(
      { success: false, message: 'Comment not found' },
      { status: 404 }
    )
  }),

  http.put(`${API_BASE}/api/comment/approve/:id`, ({ params }) => {
    const comment = mockComments.find(c => c._id === params.id)
    if (comment) {
      return HttpResponse.json({
        success: true,
        message: 'Comment approved',
        comment: { ...comment, approved: true },
      })
    }
    return HttpResponse.json(
      { success: false, message: 'Comment not found' },
      { status: 404 }
    )
  }),

  // Admin endpoints
  http.get(`${API_BASE}/api/admin/blogs`, () => {
    return HttpResponse.json({
      success: true,
      blogs: mockBlogs,
    })
  }),

  http.get(`${API_BASE}/api/admin/comments`, () => {
    return HttpResponse.json({
      success: true,
      comments: mockComments,
    })
  }),

  http.get(`${API_BASE}/api/admin/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      stats: {
        totalBlogs: mockBlogs.length,
        publishedBlogs: mockBlogs.filter(b => b.isPublished).length,
        totalComments: mockComments.length,
        approvedComments: mockComments.filter(c => c.approved).length,
      },
    })
  }),

  // Auth endpoints
  http.post(`${API_BASE}/api/admin/login`, async () => {
    return HttpResponse.json({
      success: true,
      token: 'mock-jwt-token',
      message: 'Login successful',
    })
  }),

  http.post(`${API_BASE}/api/admin/register`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'Registration successful',
    })
  }),

  // AI Content generation
  http.post(`${API_BASE}/api/blog/generate`, async () => {
    return HttpResponse.json({
      success: true,
      content: '<p>AI generated content for the blog post</p>',
    })
  }),
]
