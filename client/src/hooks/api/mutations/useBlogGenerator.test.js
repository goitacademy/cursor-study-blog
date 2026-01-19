import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBlogGenerator } from './useBlogGenerator'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import { parse } from 'marked'

vi.mock('@/context/AppContext')
vi.mock('marked')

describe('useBlogGenerator', () => {
  const mockAxios = {
    post: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useAppContext.mockReturnValue({
      axios: mockAxios
    })
    parse.mockImplementation((content) => `<p>${content}</p>`)
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useBlogGenerator())

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.inProgress).toBe(false)
    expect(result.current.generatedContent).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should generate content successfully', async () => {
    const mockContent = 'Generated blog content in markdown'
    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        content: mockContent,
        message: 'Content generated'
      }
    })

    const { result } = renderHook(() => useBlogGenerator())

    const response = await result.current.generateContent('Blog Title')

    expect(mockAxios.post).toHaveBeenCalledWith('/api/blog/generate', { 
      prompt: 'Blog Title' 
    })
    expect(parse).toHaveBeenCalledWith(mockContent)
    expect(toast.success).toHaveBeenCalledWith('Content generated successfully!')
  })

  it('should reject empty prompt', async () => {
    const { result } = renderHook(() => useBlogGenerator())

    const response = await result.current.generateContent('')

    expect(response.success).toBe(false)
    expect(response.message).toBe('Title required')
    expect(toast.error).toHaveBeenCalledWith('Please enter a title')
    expect(mockAxios.post).not.toHaveBeenCalled()
  })

  it('should reject whitespace-only prompt', async () => {
    const { result } = renderHook(() => useBlogGenerator())

    const response = await result.current.generateContent('   ')

    expect(response.success).toBe(false)
    expect(toast.error).toHaveBeenCalledWith('Please enter a title')
    expect(mockAxios.post).not.toHaveBeenCalled()
  })

  it('should reject null prompt', async () => {
    const { result } = renderHook(() => useBlogGenerator())

    const response = await result.current.generateContent(null)

    expect(response.success).toBe(false)
    expect(mockAxios.post).not.toHaveBeenCalled()
  })

  it('should handle generation error', async () => {
    const errorMessage = 'AI service unavailable'
    mockAxios.post.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useBlogGenerator())

    const response = await result.current.generateContent('Blog Title')

    expect(response.success).toBe(false)
    expect(toast.error).toHaveBeenCalled()
  })

  it('should parse markdown content to HTML', async () => {
    const mockMarkdown = '# Heading\n\nParagraph text'
    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        content: mockMarkdown
      }
    })

    const { result } = renderHook(() => useBlogGenerator())

    await result.current.generateContent('Blog Title')

    expect(parse).toHaveBeenCalledWith(mockMarkdown)
  })

  it('should set isGenerating during content generation', async () => {
    let resolvePromise
    mockAxios.post.mockReturnValue(
      new Promise(resolve => {
        resolvePromise = resolve
      })
    )

    const { result } = renderHook(() => useBlogGenerator())

    const generatePromise = result.current.generateContent('Blog Title')

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(true)
      expect(result.current.inProgress).toBe(true)
    })

    resolvePromise({
      data: { success: true, content: 'Generated content' }
    })

    await generatePromise

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false)
      expect(result.current.inProgress).toBe(false)
    })
  })

  it('should clear generated content', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        content: 'Generated content'
      }
    })

    const { result } = renderHook(() => useBlogGenerator())

    await act(async () => {
      await result.current.generateContent('Blog Title')
    })

    await waitFor(() => {
      expect(result.current.generatedContent).not.toBe(null)
    })

    act(() => {
      result.current.clearContent()
    })

    expect(result.current.generatedContent).toBe(null)
  })

  it('should handle API success but empty content', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        content: ''
      }
    })

    const { result } = renderHook(() => useBlogGenerator())

    await result.current.generateContent('Blog Title')

    expect(parse).toHaveBeenCalledWith('')
  })

  it('should handle unsuccessful API response', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        success: false,
        message: 'Generation failed'
      }
    })

    const { result } = renderHook(() => useBlogGenerator())

    const response = await result.current.generateContent('Blog Title')

    expect(response.success).toBe(false)
    expect(toast.error).toHaveBeenCalled()
  })

  it('should accept long prompts', async () => {
    const longPrompt = 'A'.repeat(500)
    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        content: 'Generated content'
      }
    })

    const { result } = renderHook(() => useBlogGenerator())

    const response = await result.current.generateContent(longPrompt)

    expect(mockAxios.post).toHaveBeenCalledWith('/api/blog/generate', { 
      prompt: longPrompt 
    })
  })

  it('should provide clearContent function', () => {
    const { result } = renderHook(() => useBlogGenerator())

    expect(typeof result.current.clearContent).toBe('function')
  })
})
