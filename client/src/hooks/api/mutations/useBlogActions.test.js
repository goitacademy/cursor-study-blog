import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBlogActions } from './useBlogActions'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

vi.mock('@/context/AppContext')

describe('useBlogActions', () => {
  const mockAxios = {
    post: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useAppContext.mockReturnValue({
      axios: mockAxios
    })
    window.confirm = vi.fn(() => true)
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useBlogActions())

    expect(result.current.isDeleting).toBe(false)
    expect(result.current.isPublishing).toBe(false)
    expect(result.current.inProgress).toBe(false)
    expect(result.current.error).toBe(null)
  })

  describe('deleteBlog', () => {
    it('should delete blog successfully', async () => {
      mockAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: 'Blog deleted successfully'
        }
      })

      const { result } = renderHook(() => useBlogActions())

      const response = await result.current.deleteBlog('123')

      expect(mockAxios.post).toHaveBeenCalledWith('/api/blog/delete', { id: '123' })
      expect(response.success).toBe(true)
      expect(toast.success).toHaveBeenCalled()
      expect(result.current.isDeleting).toBe(false)
    })

    it('should show confirmation dialog before deleting', async () => {
      mockAxios.post.mockResolvedValue({
        data: { success: true }
      })

      const { result } = renderHook(() => useBlogActions())

      await result.current.deleteBlog('123')

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this blog?')
    })

    it('should cancel delete when confirmation is rejected', async () => {
      window.confirm = vi.fn(() => false)

      const { result } = renderHook(() => useBlogActions())

      const response = await result.current.deleteBlog('123')

      expect(response.success).toBe(false)
      expect(response.cancelled).toBe(true)
      expect(mockAxios.post).not.toHaveBeenCalled()
    })

    it('should handle delete error', async () => {
      const errorMessage = 'Failed to delete blog'
      mockAxios.post.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useBlogActions())

      const response = await result.current.deleteBlog('123')

      expect(response.success).toBe(false)
      expect(toast.error).toHaveBeenCalled()
      expect(result.current.isDeleting).toBe(false)
    })

    it('should set isDeleting during deletion', async () => {
      let resolvePromise
      mockAxios.post.mockReturnValue(
        new Promise(resolve => {
          resolvePromise = resolve
        })
      )

      const { result } = renderHook(() => useBlogActions())

      let deletePromise
      act(() => {
        deletePromise = result.current.deleteBlog('123')
      })

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(true)
        expect(result.current.inProgress).toBe(true)
      })

      await act(async () => {
        resolvePromise({
          data: { success: true }
        })
        await deletePromise
      })

      expect(result.current.isDeleting).toBe(false)
      expect(result.current.inProgress).toBe(false)
    })
  })

  describe('publishBlog', () => {
    it('should publish blog successfully', async () => {
      mockAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: 'Blog published successfully'
        }
      })

      const { result } = renderHook(() => useBlogActions())

      const response = await result.current.publishBlog('123')

      expect(mockAxios.post).toHaveBeenCalledWith('/api/blog/publish', { id: '123' })
      expect(response.success).toBe(true)
      expect(toast.success).toHaveBeenCalledWith('Blog published successfully')
      expect(result.current.isPublishing).toBe(false)
    })

    it('should handle publish error', async () => {
      mockAxios.post.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useBlogActions())

      const response = await result.current.publishBlog('123')

      expect(response.success).toBe(false)
      expect(toast.error).toHaveBeenCalled()
    })

    it('should set isPublishing during publish', async () => {
      let resolvePromise
      mockAxios.post.mockReturnValue(
        new Promise(resolve => {
          resolvePromise = resolve
        })
      )

      const { result } = renderHook(() => useBlogActions())

      let publishPromise
      act(() => {
        publishPromise = result.current.publishBlog('123')
      })

      await waitFor(() => {
        expect(result.current.isPublishing).toBe(true)
        expect(result.current.inProgress).toBe(true)
      })

      await act(async () => {
        resolvePromise({
          data: { success: true }
        })
        await publishPromise
      })

      expect(result.current.isPublishing).toBe(false)
    })
  })

  describe('unpublishBlog', () => {
    it('should unpublish blog successfully', async () => {
      mockAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: 'Blog unpublished successfully'
        }
      })

      const { result } = renderHook(() => useBlogActions())

      const response = await result.current.unpublishBlog('123')

      expect(mockAxios.post).toHaveBeenCalledWith('/api/blog/unpublish', { id: '123' })
      expect(response.success).toBe(true)
      expect(toast.success).toHaveBeenCalledWith('Blog unpublished successfully')
      expect(result.current.isPublishing).toBe(false)
    })

    it('should handle unpublish error', async () => {
      mockAxios.post.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useBlogActions())

      const response = await result.current.unpublishBlog('123')

      expect(response.success).toBe(false)
      expect(toast.error).toHaveBeenCalled()
    })

    it('should set isPublishing during unpublish', async () => {
      let resolvePromise
      mockAxios.post.mockReturnValue(
        new Promise(resolve => {
          resolvePromise = resolve
        })
      )

      const { result } = renderHook(() => useBlogActions())

      let unpublishPromise
      act(() => {
        unpublishPromise = result.current.unpublishBlog('123')
      })

      await waitFor(() => {
        expect(result.current.isPublishing).toBe(true)
      })

      await act(async () => {
        resolvePromise({
          data: { success: true }
        })
        await unpublishPromise
      })

      expect(result.current.isPublishing).toBe(false)
    })
  })

  it('should track inProgress for both delete and publish operations', () => {
    const { result } = renderHook(() => useBlogActions())

    expect(result.current.inProgress).toBe(false)
  })
})
