import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, userEvent, waitFor } from '@/test/utils'
import { renderWithProviders } from '@/test/utils'
import CommentForm from './CommentForm'

describe('CommentForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render comment form with title', () => {
    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    expect(screen.getByText('comment.title')).toBeInTheDocument()
  })

  it('should render name input field', () => {
    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    expect(nameInput).toBeInTheDocument()
  })

  it('should render content textarea', () => {
    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    expect(contentInput).toBeInTheDocument()
  })

  it('should render submit button', () => {
    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /common.submit/i })
    expect(submitButton).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: true })

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    const submitButton = screen.getByRole('button', { name: /common.submit/i })

    await user.type(nameInput, 'John Doe')
    await user.type(contentInput, 'Great article!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        content: 'Great article!'
      })
    })
  })

  it('should show validation error when name is missing', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    const submitButton = screen.getByRole('button', { name: /common.submit/i })

    await user.type(contentInput, 'Great article!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('validation.nameRequired')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should show validation error when content is missing', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    const submitButton = screen.getByRole('button', { name: /common.submit/i })

    await user.type(nameInput, 'John Doe')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('validation.commentRequired')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: true })

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    const submitButton = screen.getByRole('button', { name: /common.submit/i })

    await user.type(nameInput, 'John Doe')
    await user.type(contentInput, 'Great article!')
    await user.click(submitButton)

    // Wait for submit to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    // Wait for form reset - re-query the inputs
    await waitFor(() => {
      const updatedNameInput = screen.getByPlaceholderText('comment.namePlaceholder')
      const updatedContentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
      expect(updatedNameInput).toHaveValue('')
      expect(updatedContentInput).toHaveValue('')
    })
  })

  it('should not reset form when submission fails', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: false })

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    const submitButton = screen.getByRole('button', { name: /common.submit/i })

    await user.type(nameInput, 'John Doe')
    await user.type(contentInput, 'Great article!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    expect(nameInput).toHaveValue('John Doe')
    expect(contentInput).toHaveValue('Great article!')
  })

  it('should disable submit button during submission', async () => {
    const user = userEvent.setup()
    
    let resolveSubmit
    mockOnSubmit.mockReturnValue(
      new Promise(resolve => {
        resolveSubmit = resolve
      })
    )

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    const submitButton = screen.getByRole('button', { name: /common.submit/i })

    await user.type(nameInput, 'John Doe')
    await user.type(contentInput, 'Great article!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })

    resolveSubmit({ success: true })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should show loading state on submit button when loading prop is true', () => {
    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} loading={true} />)

    const submitButton = screen.getByRole('button', { name: /common.submit/i })
    expect(submitButton).toBeDisabled()
  })

  it('should enforce character limit on content field', () => {
    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    expect(contentInput).toHaveAttribute('maxlength', '650')
  })

  it('should display character count', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    
    await user.type(contentInput, 'Test comment')

    expect(screen.getByText(/12\/650/)).toBeInTheDocument()
  })

  it('should handle long comment text', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: true })

    renderWithProviders(<CommentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('comment.namePlaceholder')
    const contentInput = screen.getByPlaceholderText('comment.contentPlaceholder')
    const submitButton = screen.getByRole('button', { name: /common.submit/i })

    const longComment = 'A'.repeat(500)

    await user.type(nameInput, 'John Doe')
    await user.type(contentInput, longComment)
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        content: longComment
      })
    })
  })
})
