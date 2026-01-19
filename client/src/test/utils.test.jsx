import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, useTestAppContext } from './utils'

// Test component that uses the test context
function TestComponent() {
  const { navigate, token, blogs } = useTestAppContext()
  
  return (
    <div>
      <div data-testid="token">{token || 'no-token'}</div>
      <div data-testid="blog-count">{blogs.length}</div>
      <button onClick={() => navigate('/test')}>Navigate</button>
    </div>
  )
}

describe('renderWithProviders', () => {
  it('should provide context values to components via TestAppContext', () => {
    const mockNavigate = vi.fn()
    const mockBlogs = [{ id: 1 }, { id: 2 }]

    renderWithProviders(<TestComponent />, {
      contextValue: {
        navigate: mockNavigate,
        token: 'test-token',
        blogs: mockBlogs
      }
    })

    expect(screen.getByTestId('token')).toHaveTextContent('test-token')
    expect(screen.getByTestId('blog-count')).toHaveTextContent('2')
  })

  it('should use default context values when none provided', () => {
    renderWithProviders(<TestComponent />)

    expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    expect(screen.getByTestId('blog-count')).toHaveTextContent('0')
  })

  it('should merge provided values with defaults', () => {
    renderWithProviders(<TestComponent />, {
      contextValue: {
        token: 'custom-token'
        // blogs not provided, should use default []
      }
    })

    expect(screen.getByTestId('token')).toHaveTextContent('custom-token')
    expect(screen.getByTestId('blog-count')).toHaveTextContent('0')
  })

  it('should return merged contextValue', () => {
    const result = renderWithProviders(<TestComponent />, {
      contextValue: {
        token: 'my-token'
      }
    })

    expect(result.contextValue.token).toBe('my-token')
    expect(result.contextValue.blogs).toEqual([])
    expect(result.contextValue.navigate).toBeDefined()
  })
})
