# Testing Guide - StudySprint Blog

## 🎯 Overview

This project uses **Vitest** as the test runner with **React Testing Library** for component testing and **MSW (Mock Service Worker)** for API mocking. All tests are co-located with their corresponding code files.

## 🚀 Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm run test

# Run tests with UI (interactive browser interface)
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (explicit)
npm run test:watch
```

## 📁 Project Structure

Tests are co-located with their source files:

```
src/
├── components/
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   ├── Footer.test.jsx          ✅
│   │   └── index.js
├── hooks/
│   ├── core/
│   │   ├── useApiQuery.js
│   │   └── useApiQuery.test.js      ✅
│   └── utils/
│       ├── useForm.js
│       └── useForm.test.js          ✅
├── pages/
│   └── public/
│       └── Home/
│           └── components/
│               └── BlogList/
│                   ├── BlogList.jsx
│                   └── BlogList.test.jsx  ✅
└── test/
    ├── setup.js              # Global test setup
    ├── utils.jsx             # Custom render & test utilities
    └── mocks/
        ├── handlers.js       # MSW request handlers
        └── server.js         # MSW server instance
```

## 🧪 Testing Patterns

### Pattern 1: Testing Presentational Components

**Example:** Footer, Navbar

**What to test:**
- ✅ Renders with correct text/translations
- ✅ User interactions (clicks, navigation)
- ✅ Conditional rendering based on props/state

**Example:**

```javascript
import { describe, it, expect, vi } from 'vitest'
import { screen, userEvent, renderWithProviders } from '@/test/utils'
import Footer from './Footer'

describe('Footer', () => {
  it('should navigate when link is clicked', async () => {
    const mockNavigate = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<Footer />, {
      contextValue: { navigate: mockNavigate }
    })

    await user.click(screen.getByText('footer.allArticles'))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
```

### Pattern 2: Testing Data-Driven Components

**Example:** BlogList

**What to test:**
- ✅ Renders correct data
- ✅ Empty states
- ✅ Filtering and searching
- ✅ User interactions

**Example:**

```javascript
import { renderWithProviders, createMockBlog } from '@/test/utils'

describe('BlogList', () => {
  it('should filter blogs by category', async () => {
    const mockBlogs = [
      createMockBlog({ category: 'Technology' }),
      createMockBlog({ category: 'Lifestyle' })
    ]

    renderWithProviders(<BlogList />, {
      contextValue: { blogs: mockBlogs }
    })

    const techTab = screen.getByText('Technology')
    await user.click(techTab)

    expect(screen.getByText(/Technology/)).toBeInTheDocument()
    expect(screen.queryByText(/Lifestyle/)).not.toBeInTheDocument()
  })
})
```

### Pattern 3: Testing Form Components

**Example:** CommentForm

**What to test:**
- ✅ Form validation
- ✅ Submit with valid/invalid data
- ✅ Form reset after success
- ✅ Loading states
- ✅ Character limits

**Example:**

```javascript
describe('CommentForm', () => {
  it('should show validation error for missing field', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<CommentForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByText('validation.nameRequired')).toBeInTheDocument()
  })

  it('should reset form after successful submission', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true })
    const user = userEvent.setup()

    renderWithProviders(<CommentForm onSubmit={mockSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    await user.type(nameInput, 'John Doe')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(nameInput).toHaveValue('')
    })
  })
})
```

### Pattern 4: Testing Core Hooks

**Example:** useApiQuery, useApiMutation, useForm

**What to test:**
- ✅ Initial state
- ✅ Success/error states
- ✅ Loading states
- ✅ Callbacks (onSuccess, onError)
- ✅ Refetch/reset functionality

**Example:**

```javascript
import { renderHook, waitFor } from '@testing-library/react'

describe('useApiQuery', () => {
  it('should fetch data successfully', async () => {
    const mockData = { success: true, blogs: [] }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApiQuery(mockApiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
  })
})
```

### Pattern 5: Testing API Hooks

**Example:** useBlogs, useCreateBlog

**What to test:**
- ✅ Calls correct API endpoint
- ✅ Transforms data correctly
- ✅ Handles errors
- ✅ Shows toasts

**Example:**

```javascript
import { useBlogs } from './useBlogs'
import { blogApi } from '@/api'

vi.mock('@/api')

describe('useBlogs', () => {
  it('should return blogs from API', async () => {
    const mockBlogs = [{ _id: '1', title: 'Blog 1' }]
    
    blogApi.getAll.mockResolvedValue({
      data: { success: true, blogs: mockBlogs }
    })

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.blogs).toEqual(mockBlogs)
    })
  })
})
```

### Pattern 6: Testing Utility Hooks

**Example:** useDebounce

**What to test:**
- ✅ Debounces value changes
- ✅ Respects delay timing
- ✅ Cleanup on unmount

**Example:**

```javascript
import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    vi.advanceTimersByTime(500)

    await waitFor(() => {
      expect(result.current).toBe('updated')
    })
  })
})
```

## 🛠️ Test Utilities

### Custom Render Function

Use `renderWithProviders` instead of the standard `render` to automatically wrap components with required providers.

**Two Approaches for Context:**

#### Approach 1: Using Mock Context (Recommended for most tests)

For components that use `useAppContext`, mock the hook directly:

```javascript
import { renderWithProviders } from '@/test/utils'
import { useAppContext } from '@/context/AppContext'

vi.mock('@/context/AppContext')

it('should use context values', () => {
  useAppContext.mockReturnValue({
    navigate: mockNavigate,
    token: 'mock-token',
    blogs: mockBlogs
  })

  renderWithProviders(<MyComponent />)
  // Component will use mocked useAppContext values
})
```

#### Approach 2: Using Test Context Provider

For components that need to be tested with the actual context pattern (without mocking):

```javascript
import { renderWithProviders, useTestAppContext } from '@/test/utils'

// Modify your component to accept context via hook prop for testing
function MyComponent({ useContext = useAppContext }) {
  const { navigate, blogs } = useContext()
  // ... rest of component
}

// In tests
renderWithProviders(<MyComponent useContext={useTestAppContext} />, {
  contextValue: {
    navigate: mockNavigate,
    token: 'mock-token',
    blogs: mockBlogs
  },
  route: '/blog/123'
})
```

**Note:** Most tests use Approach 1 (mocking) because it's simpler and more focused. The `contextValue` parameter is available when you need actual context provider behavior.

### Mock Data Helpers

Create consistent mock data:

```javascript
import { createMockBlog, createMockComment, createMockUser } from '@/test/utils'

const blog = createMockBlog({
  _id: '1',
  title: 'Custom Title',
  category: 'Technology'
})

const comment = createMockComment({
  content: 'Great post!',
  approved: true
})
```

### Exported Utilities

All commonly used utilities are exported from `@/test/utils`:

```javascript
import {
  renderWithProviders,
  screen,
  waitFor,
  within,
  userEvent,
  createMockBlog,
  createMockComment,
  createMockUser
} from '@/test/utils'
```

## 🌐 API Mocking with MSW

All API endpoints are mocked in `/src/test/mocks/handlers.js`.

### Available Mock Endpoints

- `GET /api/blog/list` - Returns list of published blogs
- `GET /api/blog/:id` - Returns single blog
- `POST /api/blog/add` - Creates new blog
- `DELETE /api/blog/delete/:id` - Deletes blog
- `PUT /api/blog/toggle-publish/:id` - Toggles publish status
- `GET /api/comment/list/:blogId` - Returns comments for blog
- `POST /api/comment/add` - Adds comment
- `DELETE /api/comment/delete/:id` - Deletes comment
- `PUT /api/comment/approve/:id` - Approves comment
- `GET /api/admin/blogs` - Returns all blogs (admin)
- `GET /api/admin/comments` - Returns all comments (admin)
- `GET /api/admin/dashboard` - Returns dashboard stats
- `POST /api/admin/login` - Login
- `POST /api/admin/register` - Register
- `POST /api/blog/generate` - AI content generation

### Overriding Handlers in Tests

```javascript
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

it('should handle custom API response', async () => {
  server.use(
    http.get('http://localhost:5000/api/blog/list', () => {
      return HttpResponse.json({
        success: true,
        blogs: [{ _id: '1', title: 'Custom Blog' }]
      })
    })
  )

  // Your test code here
})
```

## ✅ Best Practices

### 1. Query Priority

Use queries in this order (most to least preferred):

1. **getByRole** - Most accessible
2. **getByLabelText** - For form fields
3. **getByPlaceholderText** - For inputs
4. **getByText** - For non-interactive elements
5. **getByTestId** - Last resort

```javascript
// ✅ Good
const button = screen.getByRole('button', { name: /submit/i })
const input = screen.getByLabelText('Email')

// ❌ Avoid
const button = screen.getByTestId('submit-button')
```

### 2. User Interactions

Always use `userEvent` instead of `fireEvent`:

```javascript
import { userEvent } from '@/test/utils'

// ✅ Good
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')

// ❌ Avoid
fireEvent.click(button)
```

### 3. Async Testing

Use `waitFor` for async operations:

```javascript
import { waitFor } from '@/test/utils'

await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### 4. Test Isolation

Each test should be independent:

```javascript
beforeEach(() => {
  vi.clearAllMocks()
})
```

### 5. Descriptive Test Names

Use clear, descriptive test names:

```javascript
// ✅ Good
it('should show validation error when name is missing', () => {})

// ❌ Avoid
it('validation test', () => {})
```

## 🐛 Common Pitfalls

### 1. Not Waiting for Async Updates

```javascript
// ❌ Wrong
it('should update', () => {
  render(<Component />)
  expect(screen.getByText('Updated')).toBeInTheDocument() // Fails!
})

// ✅ Correct
it('should update', async () => {
  render(<Component />)
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument()
  })
})
```

### 2. Testing Implementation Details

```javascript
// ❌ Wrong - testing internal state
expect(result.current.internalState).toBe(true)

// ✅ Correct - testing behavior
expect(screen.getByText('Visible Result')).toBeInTheDocument()
```

### 3. Not Cleaning Up Mocks

```javascript
// ✅ Always clean up
beforeEach(() => {
  vi.clearAllMocks()
})
```

## 📊 Coverage Thresholds

Current coverage goals:

- **Statements:** 70%
- **Branches:** 65%
- **Functions:** 70%
- **Lines:** 70%

Priority areas (80%+ coverage):
- Core hooks
- Shared components
- Critical user flows

View coverage report:

```bash
npm run test:coverage
```

Then open `coverage/index.html` in your browser.

## 🔍 Debugging Tests

### Using Vitest UI

```bash
npm run test:ui
```

Opens an interactive browser UI with:
- Real-time test results
- Code coverage visualization
- Test history
- Console output

### Printing Component Output

```javascript
import { screen } from '@/test/utils'

// Print entire DOM
screen.debug()

// Print specific element
screen.debug(screen.getByRole('button'))
```

### Using Console Logs

Vitest shows console output for failing tests by default.

## 🎓 Learning Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 💡 Tips

1. **Write tests as you code** - Don't leave testing for later
2. **Test behavior, not implementation** - Focus on what users see
3. **Keep tests simple** - One assertion per test when possible
4. **Use meaningful test data** - Makes tests easier to understand
5. **Run tests before committing** - Catch issues early

## 🆘 Getting Help

If you encounter issues:

1. Check this documentation first
2. Look at existing test examples in the codebase
3. Check Vitest/RTL documentation
4. Ask the team in the project channel

---

**Happy Testing! 🧪✨**
