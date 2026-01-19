import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCreateBlog } from './useCreateBlog'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

vi.mock('@/context/AppContext')

describe('useCreateBlog', () => {
  const mockAxios = {
    post: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useAppContext.mockReturnValue({
      axios: mockAxios
    })
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCreateBlog())

    expect(result.current.isCreating).toBe(false)
    expect(result.current.inProgress).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should create blog successfully with valid data', async () => {
    const mockBlogData = {
      title: 'Test Blog',
      subTitle: 'Test Subtitle',
      description: '<p>Test content</p>',
      category: 'Technology',
      isPublished: true
    }

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Blog created successfully',
        blog: { _id: '123', ...mockBlogData }
      }
    })

    const { result } = renderHook(() => useCreateBlog())

    const response = await result.current.createBlog(mockBlogData, mockFile)

    expect(response.success).toBe(true)
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/api/blog/add',
      expect.any(FormData)
    )
    expect(toast.success).toHaveBeenCalled()
  })

  it('should handle invalid image file', async () => {
    const mockBlogData = {
      title: 'Test Blog',
      description: '<p>Test content</p>',
      category: 'Technology'
    }

    const { result } = renderHook(() => useCreateBlog())

    const response = await result.current.createBlog(mockBlogData, null)

    expect(response.success).toBe(false)
    expect(response.message).toBe('Invalid image file')
    expect(mockAxios.post).not.toHaveBeenCalled()
  })

  it('should handle boolean as image file (edge case)', async () => {
    const mockBlogData = {
      title: 'Test Blog',
      description: '<p>Test content</p>',
      category: 'Technology'
    }

    const { result } = renderHook(() => useCreateBlog())

    const response = await result.current.createBlog(mockBlogData, true)

    expect(response.success).toBe(false)
    expect(response.message).toBe('Invalid image file')
  })

  it('should construct FormData correctly', async () => {
    const mockBlogData = {
      title: 'Test Blog',
      subTitle: 'Test Subtitle',
      description: '<p>Test content</p>',
      category: 'Technology',
      isPublished: false
    }

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Blog created'
      }
    })

    const { result } = renderHook(() => useCreateBlog())

    await result.current.createBlog(mockBlogData, mockFile)

    const formDataArg = mockAxios.post.mock.calls[0][1]
    expect(formDataArg).toBeInstanceOf(FormData)
  })

  it('should handle API error', async () => {
    const mockBlogData = {
      title: 'Test Blog',
      description: '<p>Test content</p>',
      category: 'Technology'
    }

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    mockAxios.post.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useCreateBlog())

    const response = await result.current.createBlog(mockBlogData, mockFile)

    expect(response.success).toBe(false)
    expect(toast.error).toHaveBeenCalled()
  })

  it('should set loading state during creation', async () => {
    const mockBlogData = {
      title: 'Test Blog',
      description: '<p>Test content</p>',
      category: 'Technology'
    }

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    let resolvePromise
    mockAxios.post.mockReturnValue(
      new Promise(resolve => {
        resolvePromise = resolve
      })
    )

    const { result } = renderHook(() => useCreateBlog())

    let createPromise
    act(() => {
      createPromise = result.current.createBlog(mockBlogData, mockFile)
    })

    await waitFor(() => {
      expect(result.current.isCreating).toBe(true)
      expect(result.current.inProgress).toBe(true)
    })

    await act(async () => {
      resolvePromise({
        data: {
          success: true,
          message: 'Created'
        }
      })
      await createPromise
    })

    expect(result.current.isCreating).toBe(false)
    expect(result.current.inProgress).toBe(false)
  })

  it('should work with draft blogs (isPublished: false)', async () => {
    const mockBlogData = {
      title: 'Draft Blog',
      subTitle: '',
      description: '<p>Draft content</p>',
      category: 'Lifestyle',
      isPublished: false
    }

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Draft saved'
      }
    })

    const { result } = renderHook(() => useCreateBlog())

    const response = await result.current.createBlog(mockBlogData, mockFile)

    expect(response.success).toBe(true)
    expect(mockAxios.post).toHaveBeenCalled()
  })
})
