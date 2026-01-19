import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCommentActions } from './useCommentActions'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

vi.mock('@/context/AppContext')

describe('useCommentActions', () => {
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
    const { result } = renderHook(() => useCommentActions())

    expect(result.current.isApproving).toBe(false)
    expect(result.current.isDeleting).toBe(false)
    expect(result.current.inProgress).toBe(false)
    expect(result.current.error).toBe(null)
  })

  describe('approveComment', () => {
    it('should approve comment successfully', async () => {
      mockAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: 'Comment approved'
        }
      })

      const { result } = renderHook(() => useCommentActions())

      const response = await result.current.approveComment('456')

      expect(mockAxios.post).toHaveBeenCalledWith('/api/admin/approve-comment', { 
        id: '456' 
      })
      expect(response.success).toBe(true)
      expect(toast.success).toHaveBeenCalled()
      expect(result.current.isApproving).toBe(false)
    })

    it('should handle approve error', async () => {
      const errorMessage = 'Failed to approve comment'
      mockAxios.post.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useCommentActions())

      const response = await result.current.approveComment('456')

      expect(response.success).toBe(false)
      expect(toast.error).toHaveBeenCalled()
      expect(result.current.isApproving).toBe(false)
    })

    it('should set isApproving during approval', async () => {
      let resolvePromise
      mockAxios.post.mockReturnValue(
        new Promise(resolve => {
          resolvePromise = resolve
        })
      )

      const { result } = renderHook(() => useCommentActions())

      let approvePromise
      act(() => {
        approvePromise = result.current.approveComment('456')
      })

      await waitFor(() => {
        expect(result.current.isApproving).toBe(true)
        expect(result.current.inProgress).toBe(true)
      })

      await act(async () => {
        resolvePromise({
          data: { success: true }
        })
        await approvePromise
      })

      expect(result.current.isApproving).toBe(false)
      expect(result.current.inProgress).toBe(false)
    })

    it('should handle unsuccessful API response', async () => {
      mockAxios.post.mockResolvedValue({
        data: {
          success: false,
          message: 'Comment not found'
        }
      })

      const { result } = renderHook(() => useCommentActions())

      const response = await result.current.approveComment('456')

      expect(response.success).toBe(false)
      expect(toast.error).toHaveBeenCalled()
    })
  })

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      mockAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: 'Comment deleted'
        }
      })

      const { result } = renderHook(() => useCommentActions())

      const response = await result.current.deleteComment('456')

      expect(mockAxios.post).toHaveBeenCalledWith('/api/admin/delete-comment', { 
        id: '456' 
      })
      expect(response.success).toBe(true)
      expect(toast.success).toHaveBeenCalled()
      expect(result.current.isDeleting).toBe(false)
    })

    it('should show confirmation dialog before deleting', async () => {
      mockAxios.post.mockResolvedValue({
        data: { success: true }
      })

      const { result } = renderHook(() => useCommentActions())

      await result.current.deleteComment('456')

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?')
    })

    it('should cancel delete when confirmation is rejected', async () => {
      window.confirm = vi.fn(() => false)

      const { result } = renderHook(() => useCommentActions())

      const response = await result.current.deleteComment('456')

      expect(response.success).toBe(false)
      expect(response.cancelled).toBe(true)
      expect(mockAxios.post).not.toHaveBeenCalled()
    })

    it('should handle delete error', async () => {
      const errorMessage = 'Failed to delete comment'
      mockAxios.post.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useCommentActions())

      const response = await result.current.deleteComment('456')

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

      const { result } = renderHook(() => useCommentActions())

      let deletePromise
      act(() => {
        deletePromise = result.current.deleteComment('456')
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

  it('should track inProgress for both approve and delete operations', () => {
    const { result } = renderHook(() => useCommentActions())

    expect(result.current.inProgress).toBe(false)
  })

  it('should handle multiple comment IDs', async () => {
    mockAxios.post.mockResolvedValue({
      data: { success: true }
    })

    const { result } = renderHook(() => useCommentActions())

    await result.current.approveComment('comment-1')
    await result.current.approveComment('comment-2')
    await result.current.deleteComment('comment-3')

    expect(mockAxios.post).toHaveBeenCalledTimes(3)
  })

  it('should provide all required action functions', () => {
    const { result } = renderHook(() => useCommentActions())

    expect(typeof result.current.approveComment).toBe('function')
    expect(typeof result.current.deleteComment).toBe('function')
  })
})
