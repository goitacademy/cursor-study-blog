import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBlogs } from './useBlogs'
import { blogApi } from '@/api'

vi.mock('@/api')

describe('useBlogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch blogs successfully', async () => {
    const mockBlogs = [
      { _id: '1', title: 'Blog 1', category: 'Technology' },
      { _id: '2', title: 'Blog 2', category: 'Lifestyle' }
    ]

    blogApi.getAll.mockResolvedValue({
      data: {
        success: true,
        blogs: mockBlogs
      }
    })

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blogs).toEqual(mockBlogs)
    expect(result.current.error).toBe(null)
  })

  it('should return empty array when data is null', () => {
    blogApi.getAll.mockResolvedValue({
      data: {
        success: true,
        blogs: null
      }
    })

    const { result } = renderHook(() => useBlogs())

    expect(result.current.blogs).toEqual([])
  })

  it('should handle empty blogs array', async () => {
    blogApi.getAll.mockResolvedValue({
      data: {
        success: true,
        blogs: []
      }
    })

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blogs).toEqual([])
  })

  it('should handle API error', async () => {
    const errorMessage = 'Failed to fetch blogs'
    blogApi.getAll.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.blogs).toEqual([])
  })

  it('should provide refetch function', async () => {
    const mockBlogs = [{ _id: '1', title: 'Blog 1' }]

    blogApi.getAll.mockResolvedValue({
      data: {
        success: true,
        blogs: mockBlogs
      }
    })

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.refetch).toBeDefined()
    expect(typeof result.current.refetch).toBe('function')
  })
})
