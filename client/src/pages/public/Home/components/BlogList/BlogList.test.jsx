import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, userEvent, waitFor } from '@/test/utils'
import { renderWithProviders, createMockBlog } from '@/test/utils'
import { useAppContext } from '@/context/AppContext'
import BlogList from './BlogList'

vi.mock('@/context/AppContext')

describe('BlogList', () => {
  const mockNavigate = vi.fn()
  const mockBlogs = [
    createMockBlog({
      _id: '1',
      title: 'Tech Blog',
      category: 'Technology',
      description: '<p>Tech content</p>'
    }),
    createMockBlog({
      _id: '2',
      title: 'Lifestyle Blog',
      category: 'Lifestyle',
      description: '<p>Lifestyle content</p>'
    }),
    createMockBlog({
      _id: '3',
      title: 'Another Tech Blog',
      category: 'Technology',
      description: '<p>More tech content</p>'
    })
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all blogs when no filter is applied', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: mockBlogs,
      input: ''
    })

    renderWithProviders(<BlogList />)

    expect(screen.getByText('Tech Blog')).toBeInTheDocument()
    expect(screen.getByText('Lifestyle Blog')).toBeInTheDocument()
    expect(screen.getByText('Another Tech Blog')).toBeInTheDocument()
  })

  it('should render empty state when no blogs exist', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: [],
      input: ''
    })

    renderWithProviders(<BlogList />)

    expect(screen.getByText('blog.noBlogs')).toBeInTheDocument()
  })

  it('should filter blogs by search input', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: mockBlogs,
      input: 'Lifestyle'
    })

    renderWithProviders(<BlogList />)

    expect(screen.getByText('Lifestyle Blog')).toBeInTheDocument()
    expect(screen.queryByText('Tech Blog')).not.toBeInTheDocument()
  })

  it('should display blog category as tag', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: [mockBlogs[0]],
      input: ''
    })

    renderWithProviders(<BlogList />)

    // Find the tag specifically (not the tab)
    const categoryTag = screen.getAllByText('Technology').find(
      el => el.classList.contains('ant-tag')
    )
    expect(categoryTag).toBeInTheDocument()
  })

  it('should display truncated blog description', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: mockBlogs,
      input: ''
    })

    renderWithProviders(<BlogList />)

    expect(screen.getByText(/Tech content/)).toBeInTheDocument()
  })

  it('should render blog images with correct alt text', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: [mockBlogs[0]],
      input: ''
    })

    renderWithProviders(<BlogList />)

    const image = screen.getByAltText('Tech Blog')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockBlogs[0].image)
  })

  it('should show empty state when search returns no results', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: mockBlogs,
      input: 'NonExistentBlog'
    })

    renderWithProviders(<BlogList />)

    expect(screen.getByText('blog.noBlogs')).toBeInTheDocument()
  })

  it('should handle case-insensitive search', () => {
    useAppContext.mockReturnValue({
      navigate: mockNavigate,
      blogs: mockBlogs,
      input: 'TECH'
    })

    renderWithProviders(<BlogList />)

    expect(screen.getByText('Tech Blog')).toBeInTheDocument()
    expect(screen.getByText('Another Tech Blog')).toBeInTheDocument()
  })
})
