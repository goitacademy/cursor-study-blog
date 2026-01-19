import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useForm } from './useForm'

describe('useForm', () => {
  it('should initialize with default values', () => {
    const initialValues = { name: 'John', email: 'john@example.com' }
    const { result } = renderHook(() => useForm(initialValues))

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should initialize with empty object when no initial values provided', () => {
    const { result } = renderHook(() => useForm())

    expect(result.current.values).toEqual({})
    expect(result.current.errors).toEqual({})
  })

  it('should update field value when handleChange is called', () => {
    const { result } = renderHook(() => useForm({ name: '' }))

    act(() => {
      result.current.handleChange('name', 'Jane')
    })

    expect(result.current.values.name).toBe('Jane')
  })

  it('should clear error when field value changes', () => {
    const { result } = renderHook(() => useForm({ name: '' }))

    act(() => {
      result.current.setFieldError('name', 'Name is required')
    })

    expect(result.current.errors.name).toBe('Name is required')

    act(() => {
      result.current.handleChange('name', 'Jane')
    })

    expect(result.current.errors.name).toBe(null)
  })

  it('should mark field as touched when handleBlur is called', () => {
    const { result } = renderHook(() => useForm({ name: '' }))

    act(() => {
      result.current.handleBlur('name')
    })

    expect(result.current.touched.name).toBe(true)
  })

  it('should update field value with setFieldValue', () => {
    const { result } = renderHook(() => useForm({ name: '' }))

    act(() => {
      result.current.setFieldValue('name', 'Updated Name')
    })

    expect(result.current.values.name).toBe('Updated Name')
  })

  it('should set field error with setFieldError', () => {
    const { result } = renderHook(() => useForm())

    act(() => {
      result.current.setFieldError('email', 'Invalid email')
    })

    expect(result.current.errors.email).toBe('Invalid email')
  })

  it('should reset form to initial values', () => {
    const initialValues = { name: 'John' }
    const { result } = renderHook(() => useForm(initialValues))

    act(() => {
      result.current.handleChange('name', 'Jane')
      result.current.setFieldError('name', 'Error')
      result.current.handleBlur('name')
    })

    expect(result.current.values.name).toBe('Jane')
    expect(result.current.errors.name).toBe('Error')
    expect(result.current.touched.name).toBe(true)

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should handle form submission successfully', async () => {
    const onSubmit = vi.fn().mockResolvedValue()
    const { result } = renderHook(() => useForm({ name: 'John' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit)
    })

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should validate form before submission', async () => {
    const onSubmit = vi.fn()
    const validate = vi.fn(() => ({ name: 'Name is required' }))
    
    const { result } = renderHook(() => useForm({ name: '' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit, validate)
    })

    expect(validate).toHaveBeenCalledWith({ name: '' })
    expect(result.current.errors.name).toBe('Name is required')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should submit when validation passes', async () => {
    const onSubmit = vi.fn().mockResolvedValue()
    const validate = vi.fn(() => ({}))
    
    const { result } = renderHook(() => useForm({ name: 'John' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit, validate)
    })

    expect(validate).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should set isSubmitting during submission', async () => {
    let resolveSubmit
    const onSubmit = vi.fn(() => 
      new Promise(resolve => {
        resolveSubmit = resolve
      })
    )

    const { result } = renderHook(() => useForm({ name: 'John' }))

    // Start submission without awaiting
    let submitPromise
    act(() => {
      submitPromise = result.current.handleSubmit(onSubmit)
    })

    // Wait for state to update
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.isSubmitting).toBe(true)

    // Resolve and wait for completion
    await act(async () => {
      resolveSubmit()
      await submitPromise
    })

    expect(result.current.isSubmitting).toBe(false)
  })

  it('should handle submission error gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Submission failed')
    const onSubmit = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useForm({ name: 'John' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit)
    })

    expect(consoleError).toHaveBeenCalledWith('Form submission error:', error)
    expect(result.current.isSubmitting).toBe(false)

    consoleError.mockRestore()
  })

  it('should handle multiple field changes', () => {
    const { result } = renderHook(() => useForm({ name: '', email: '' }))

    act(() => {
      result.current.handleChange('name', 'John')
      result.current.handleChange('email', 'john@example.com')
    })

    expect(result.current.values).toEqual({
      name: 'John',
      email: 'john@example.com'
    })
  })
})
