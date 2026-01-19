import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, userEvent } from '@/test/utils'
import { renderWithProviders } from '@/test/utils'
import { useAppContext } from '@/context/AppContext'
import Navbar from './Navbar'

vi.mock('@/context/AppContext')

describe('Navbar', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      useAppContext.mockReturnValue({
        navigate: mockNavigate,
        token: null
      })
    })

    it('should render navbar with app name and logo', () => {
      renderWithProviders(<Navbar />)

      expect(screen.getByText('common.appName')).toBeInTheDocument()
      expect(screen.getByAltText('common.appName')).toBeInTheDocument()
    })

    it('should render home button with icon', () => {
      renderWithProviders(<Navbar />)

      const homeButton = screen.getByRole('button', { name: /nav.home/i })
      expect(homeButton).toBeInTheDocument()
    })

    it('should render articles button', () => {
      renderWithProviders(<Navbar />)

      const articlesButton = screen.getByRole('button', { name: /nav.articles/i })
      expect(articlesButton).toBeInTheDocument()
    })

    it('should show Login button when not authenticated', () => {
      renderWithProviders(<Navbar />)

      const loginButton = screen.getByRole('button', { name: /nav.login/i })
      expect(loginButton).toBeInTheDocument()
    })

    it('should show Register button when not authenticated', () => {
      renderWithProviders(<Navbar />)

      const registerButton = screen.getByRole('button', { name: /nav.register/i })
      expect(registerButton).toBeInTheDocument()
    })

    it('should navigate to home when logo is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Navbar />)

      const logo = screen.getByAltText('common.appName').closest('.navbar-logo')
      await user.click(logo)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('should navigate to home when Home button is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Navbar />)

      const homeButton = screen.getByRole('button', { name: /nav.home/i })
      await user.click(homeButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('should navigate to home when Articles button is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Navbar />)

      const articlesButton = screen.getByRole('button', { name: /nav.articles/i })
      await user.click(articlesButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('should navigate to admin when Login button is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Navbar />)

      const loginButton = screen.getByRole('button', { name: /nav.login/i })
      await user.click(loginButton)

      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })

    it('should navigate to admin when Register button is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Navbar />)

      const registerButton = screen.getByRole('button', { name: /nav.register/i })
      await user.click(registerButton)

      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      useAppContext.mockReturnValue({
        navigate: mockNavigate,
        token: 'mock-auth-token'
      })
    })

    it('should show Dashboard button instead of Login', () => {
      renderWithProviders(<Navbar />)

      expect(screen.getByRole('button', { name: /nav.dashboard/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /nav.login/i })).not.toBeInTheDocument()
    })

    it('should not show Register button when authenticated', () => {
      renderWithProviders(<Navbar />)

      expect(screen.queryByRole('button', { name: /nav.register/i })).not.toBeInTheDocument()
    })

    it('should navigate to admin when Dashboard button is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Navbar />)

      const dashboardButton = screen.getByRole('button', { name: /nav.dashboard/i })
      await user.click(dashboardButton)

      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })

    it('should still render home and articles buttons', () => {
      renderWithProviders(<Navbar />)

      expect(screen.getByRole('button', { name: /nav.home/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /nav.articles/i })).toBeInTheDocument()
    })
  })

  describe('navigation structure', () => {
    beforeEach(() => {
      useAppContext.mockReturnValue({
        navigate: mockNavigate,
        token: null
      })
    })

    it('should render navigation element', () => {
      const { container } = renderWithProviders(<Navbar />)

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('navbar')
    })

    it('should render logo section', () => {
      const { container } = renderWithProviders(<Navbar />)

      const logoSection = container.querySelector('.navbar-logo')
      expect(logoSection).toBeInTheDocument()
    })

    it('should render navigation buttons section', () => {
      const { container } = renderWithProviders(<Navbar />)

      const navSection = container.querySelector('.navbar-nav')
      expect(navSection).toBeInTheDocument()
    })
  })

  describe('button types', () => {
    beforeEach(() => {
      useAppContext.mockReturnValue({
        navigate: mockNavigate,
        token: null
      })
    })

    it('should render Home button as text type', () => {
      renderWithProviders(<Navbar />)

      const homeButton = screen.getByRole('button', { name: /nav.home/i })
      expect(homeButton).toHaveClass('ant-btn-text')
    })

    it('should render Articles button as text type', () => {
      renderWithProviders(<Navbar />)

      const articlesButton = screen.getByRole('button', { name: /nav.articles/i })
      expect(articlesButton).toHaveClass('ant-btn-text')
    })

    it('should render Login button as primary type', () => {
      renderWithProviders(<Navbar />)

      const loginButton = screen.getByRole('button', { name: /nav.login/i })
      expect(loginButton).toHaveClass('ant-btn-primary')
    })
  })

  describe('accessibility', () => {
    beforeEach(() => {
      useAppContext.mockReturnValue({
        navigate: mockNavigate,
        token: null
      })
    })

    it('should have accessible logo image with alt text', () => {
      renderWithProviders(<Navbar />)

      const logo = screen.getByAltText('common.appName')
      expect(logo).toBeInTheDocument()
    })

    it('should render Home button with icon', () => {
      renderWithProviders(<Navbar />)

      const homeButton = screen.getByRole('button', { name: /nav.home/i })
      const icon = homeButton.querySelector('.anticon-home')
      expect(icon).toBeInTheDocument()
    })

    it('should have all navigation buttons accessible by role', () => {
      renderWithProviders(<Navbar />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
