import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApiMutation } from './useApiMutation'
import toast from 'react-hot-toast'

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useApiMutation())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.inProgress).toBe(false)
  })

  it('should successfully mutate data', async () => {
    const mockData = { success: true, message: 'Success' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApiMutation())

    const response = await result.current.mutate(mockApiCall, {
      successMessage: 'Operation successful'
    })

    expect(response.success).toBe(true)
    expect(response.data).toEqual(mockData)
    expect(result.current.loading).toBe(false)
    expect(toast.success).toHaveBeenCalledWith('Operation successful')
  })

  it('should handle mutation error', async () => {
    const errorMessage = 'Mutation failed'
    const mockApiCall = vi.fn().mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useApiMutation())

    const response = await act(async () => {
      return await result.current.mutate(mockApiCall, {
        errorMessage: 'Custom error'
      })
    })

    expect(response.success).toBe(false)
    expect(response.message).toBe(errorMessage)
    expect(result.current.error).toBe(errorMessage)
    expect(toast.error).toHaveBeenCalledWith(errorMessage)
  })

  it('should handle unsuccessful response', async () => {
    const errorMsg = 'Operation failed'
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: errorMsg }
    })

    const { result } = renderHook(() => useApiMutation())

    const response = await act(async () => {
      return await result.current.mutate(mockApiCall)
    })

    expect(response.success).toBe(false)
    expect(response.message).toBe(errorMsg)
    expect(result.current.error).toBe(errorMsg)
    expect(toast.error).toHaveBeenCalledWith(errorMsg)
  })

  it('should call onSuccess callback', async () => {
    const mockData = { success: true, data: 'test' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })
    const onSuccess = vi.fn()

    const { result } = renderHook(() => useApiMutation())

    await result.current.mutate(mockApiCall, { onSuccess })

    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })

  it('should call onError callback', async () => {
    const errorMessage = 'Error occurred'
    const mockApiCall = vi.fn().mockRejectedValue(new Error(errorMessage))
    const onError = vi.fn()

    const { result } = renderHook(() => useApiMutation())

    await result.current.mutate(mockApiCall, { onError })

    expect(onError).toHaveBeenCalledWith(errorMessage)
  })

  it('should handle confirmation dialog when confirmMessage is provided', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({ 
      data: { success: true } 
    })

    const { result } = renderHook(() => useApiMutation())

    window.confirm = vi.fn(() => true)

    await result.current.mutate(mockApiCall, {
      confirmMessage: 'Are you sure?'
    })

    expect(window.confirm).toHaveBeenCalledWith('Are you sure?')
    expect(mockApiCall).toHaveBeenCalled()
  })

  it('should cancel operation when confirmation is rejected', async () => {
    const mockApiCall = vi.fn()

    const { result } = renderHook(() => useApiMutation())

    window.confirm = vi.fn(() => false)

    const response = await result.current.mutate(mockApiCall, {
      confirmMessage: 'Are you sure?'
    })

    expect(response.success).toBe(false)
    expect(response.cancelled).toBe(true)
    expect(mockApiCall).not.toHaveBeenCalled()
  })

  it('should not show toast when showSuccessToast is false', async () => {
    const mockData = { success: true, message: 'Success' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApiMutation())

    await result.current.mutate(mockApiCall, {
      successMessage: 'Success',
      showSuccessToast: false
    })

    expect(toast.success).not.toHaveBeenCalled()
  })

  it('should not show error toast when showErrorToast is false', async () => {
    const mockApiCall = vi.fn().mockRejectedValue(new Error('Error'))

    const { result } = renderHook(() => useApiMutation())

    await result.current.mutate(mockApiCall, {
      showErrorToast: false
    })

    expect(toast.error).not.toHaveBeenCalled()
  })

  it('should respect showToast option from hook initialization', async () => {
    const mockData = { success: true, message: 'Success' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApiMutation({ showToast: false }))

    await result.current.mutate(mockApiCall, {
      successMessage: 'Success'
    })

    expect(toast.success).not.toHaveBeenCalled()
  })

  it('should reset state when reset is called', async () => {
    const mockApiCall = vi.fn().mockRejectedValue(new Error('Error'))

    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(mockApiCall)
    })

    expect(result.current.error).toBeTruthy()

    act(() => {
      result.current.reset()
    })

    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  it('should set loading state during mutation', async () => {
    let resolvePromise
    const mockApiCall = vi.fn(() => 
      new Promise(resolve => {
        resolvePromise = resolve
      })
    )

    const { result } = renderHook(() => useApiMutation())

    let mutationPromise
    act(() => {
      mutationPromise = result.current.mutate(mockApiCall)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await act(async () => {
      resolvePromise({ data: { success: true } })
      await mutationPromise
    })

    expect(result.current.loading).toBe(false)
  })
})
