import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApiQuery } from './useApiQuery'
import toast from 'react-hot-toast'

describe('useApiQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const mockApiCall = vi.fn()
    const { result } = renderHook(() => useApiQuery(mockApiCall))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should fetch data successfully on mount', async () => {
    const mockData = { success: true, blogs: ['blog1', 'blog2'] }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApiQuery(mockApiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
    expect(mockApiCall).toHaveBeenCalledTimes(1)
  })

  it('should handle API error', async () => {
    const errorMessage = 'Failed to fetch'
    const mockApiCall = vi.fn().mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => 
      useApiQuery(mockApiCall, { errorMessage: 'Custom error message' })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(errorMessage)
    expect(toast.error).toHaveBeenCalledWith(errorMessage)
  })

  it('should handle unsuccessful response', async () => {
    const errorMsg = 'Request failed'
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: errorMsg }
    })

    const { result } = renderHook(() => useApiQuery(mockApiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(errorMsg)
    expect(toast.error).toHaveBeenCalledWith(errorMsg)
  })

  it('should not fetch when enabled is false', () => {
    const mockApiCall = vi.fn()

    const { result } = renderHook(() => 
      useApiQuery(mockApiCall, { enabled: false })
    )

    expect(result.current.loading).toBe(false)
    expect(mockApiCall).not.toHaveBeenCalled()
  })

  it('should call onSuccess callback on successful fetch', async () => {
    const mockData = { success: true, data: 'test' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })
    const onSuccess = vi.fn()

    renderHook(() => useApiQuery(mockApiCall, { onSuccess }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockData)
    })
  })

  it('should call onError callback on error', async () => {
    const errorMessage = 'Failed to fetch'
    const mockApiCall = vi.fn().mockRejectedValue(new Error(errorMessage))
    const onError = vi.fn()

    renderHook(() => useApiQuery(mockApiCall, { onError }))

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('should refetch data when refetch is called', async () => {
    const mockData = { success: true, data: 'test' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApiQuery(mockApiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockApiCall).toHaveBeenCalledTimes(1)

    result.current.refetch()

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledTimes(2)
    })
  })

  it('should not show toast when showErrorToast is false', async () => {
    const mockApiCall = vi.fn().mockRejectedValue(new Error('Error'))

    renderHook(() => 
      useApiQuery(mockApiCall, { showErrorToast: false })
    )

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled()
    })
  })

  it('should refetch when dependencies change', async () => {
    const mockData = { success: true, data: 'test' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result, rerender } = renderHook(
      ({ dep }) => useApiQuery(mockApiCall, { dependencies: [dep] }),
      { initialProps: { dep: 1 } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockApiCall).toHaveBeenCalledTimes(1)

    rerender({ dep: 2 })

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledTimes(2)
    })
  })
})
