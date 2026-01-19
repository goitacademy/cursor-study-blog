import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, userEvent } from '@/test/utils'
import { renderWithProviders } from '@/test/utils'
import { useAppContext } from '@/context/AppContext'
import Footer from './Footer'

vi.mock('@/context/AppContext')

describe('Footer', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAppContext.mockReturnValue({
      navigate: mockNavigate
    })
  })

  it('should render footer with app name and logo', () => {
    renderWithProviders(<Footer />)

    expect(screen.getByText('common.appName')).toBeInTheDocument()
    expect(screen.getByAltText('common.appName')).toBeInTheDocument()
  })

  it('should render copyright text', () => {
    renderWithProviders(<Footer />)

    expect(screen.getByText('common.copyright')).toBeInTheDocument()
  })

  it('should render Quick Links section', () => {
    renderWithProviders(<Footer />)

    expect(screen.getByText('footer.quickLinks')).toBeInTheDocument()
    expect(screen.getByText('footer.allArticles')).toBeInTheDocument()
    expect(screen.getByText('nav.login')).toBeInTheDocument()
    expect(screen.getByText('nav.register')).toBeInTheDocument()
  })

  it('should render Follow Us section', () => {
    renderWithProviders(<Footer />)

    expect(screen.getByText('footer.followUs')).toBeInTheDocument()
    expect(screen.getByText('footer.instagram')).toBeInTheDocument()
    expect(screen.getByText('footer.twitter')).toBeInTheDocument()
    expect(screen.getByText('footer.facebook')).toBeInTheDocument()
    expect(screen.getByText('footer.youtube')).toBeInTheDocument()
  })

  it('should navigate to home when All Articles is clicked', async () => {
    const user = userEvent.setup()

    renderWithProviders(<Footer />)

    const allArticlesLink = screen.getByText('footer.allArticles')
    await user.click(allArticlesLink)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate to admin when Login is clicked', async () => {
    const user = userEvent.setup()

    renderWithProviders(<Footer />)

    const loginLink = screen.getByText('nav.login')
    await user.click(loginLink)

    expect(mockNavigate).toHaveBeenCalledWith('/admin')
  })

  it('should navigate to admin when Register is clicked', async () => {
    const user = userEvent.setup()

    renderWithProviders(<Footer />)

    const registerLink = screen.getByText('nav.register')
    await user.click(registerLink)

    expect(mockNavigate).toHaveBeenCalledWith('/admin')
  })

  it('should render social links with correct hrefs', () => {
    renderWithProviders(<Footer />)

    const socialLinks = [
      'footer.instagram',
      'footer.twitter',
      'footer.facebook',
      'footer.youtube'
    ]

    socialLinks.forEach(linkText => {
      const link = screen.getByText(linkText).closest('a')
      expect(link).toHaveAttribute('href', '#')
    })
  })

  it('should render logo image with correct source', () => {
    renderWithProviders(<Footer />)

    const logo = screen.getByAltText('common.appName')
    expect(logo).toHaveAttribute('src')
  })
})
