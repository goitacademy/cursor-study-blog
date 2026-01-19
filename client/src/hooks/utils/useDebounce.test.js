import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    expect(result.current).toBe('initial')

    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('should reset debounce timer on multiple rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'change1' })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    rerender({ value: 'change2' })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    rerender({ value: 'final' })
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('final')
  })

  it('should use default delay of 500ms when not provided', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })

    await act(async () => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('initial')

    await act(async () => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe('updated')
  })

  it('should cleanup timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('value', 500))

    expect(() => unmount()).not.toThrow()
  })

  it('should work with different data types', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42 })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(42)

    rerender({ value: true })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(true)

    rerender({ value: { name: 'test' } })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toEqual({ name: 'test' })
  })

  it('should handle custom delay times', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    )

    rerender({ value: 'updated', delay: 1000 })

    await act(async () => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current).toBe('initial')

    await act(async () => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe('updated')
  })
})
