import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { vi } from 'vitest'
import { createContext, useContext } from 'react'

// Create a test-specific context that mimics AppContext
const TestAppContext = createContext(null)

// Export a hook that can be used in tests (mimics useAppContext)
export const useTestAppContext = () => {
  const context = useContext(TestAppContext)
  if (!context) {
    throw new Error('useTestAppContext must be used within TestAppContext.Provider')
  }
  return context
}

// Default mock values for AppContext
export const defaultContextValue = {
  axios: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  navigate: vi.fn(),
  token: null,
  setToken: vi.fn(),
  blogs: [],
  setBlogs: vi.fn(),
  input: '',
  setInput: vi.fn(),
  fetchBlogs: vi.fn(),
}

// Custom render function that wraps components with all necessary providers
export function renderWithProviders(
  ui,
  {
    contextValue = {},
    route = '/',
    ...renderOptions
  } = {}
) {
  // Merge provided context values with defaults
  const mergedContextValue = {
    ...defaultContextValue,
    ...contextValue,
  }

  window.history.pushState({}, 'Test page', route)

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <ConfigProvider>
          <TestAppContext.Provider value={mergedContextValue}>
            {children}
          </TestAppContext.Provider>
        </ConfigProvider>
      </BrowserRouter>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    contextValue: mergedContextValue,
  }
}

// Helper to create mock blog data
export function createMockBlog(overrides = {}) {
  return {
    _id: '123',
    title: 'Test Blog Title',
    subTitle: 'Test Subtitle',
    description: '<p>Test description content</p>',
    category: 'Technology',
    image: 'https://example.com/image.jpg',
    author: 'Test Author',
    authorImg: 'https://example.com/author.jpg',
    date: new Date().toISOString(),
    isPublished: true,
    ...overrides,
  }
}

// Helper to create mock comment data
export function createMockComment(overrides = {}) {
  return {
    _id: '456',
    blogId: '123',
    name: 'Test User',
    content: 'Test comment content',
    date: new Date().toISOString(),
    approved: false,
    ...overrides,
  }
}

// Helper to create mock user data
export function createMockUser(overrides = {}) {
  return {
    _id: '789',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  }
}

// Helper to wait for async updates
export { waitFor, screen, within } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
