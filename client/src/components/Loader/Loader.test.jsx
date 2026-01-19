import { describe, it, expect } from 'vitest'
import { screen } from '@/test/utils'
import { renderWithProviders } from '@/test/utils'
import Loader from './Loader'

describe('Loader', () => {
  it('should render loader component', () => {
    const { container } = renderWithProviders(<Loader />)

    const loaderContainer = container.querySelector('.loader-container')
    expect(loaderContainer).toBeInTheDocument()
  })

  it('should render Ant Design Spin component', () => {
    const { container } = renderWithProviders(<Loader />)

    const spinner = container.querySelector('.ant-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('should render large size spinner', () => {
    const { container } = renderWithProviders(<Loader />)

    const largeSpinner = container.querySelector('.ant-spin-lg')
    expect(largeSpinner).toBeInTheDocument()
  })

  it('should center the loader using Flex', () => {
    const { container } = renderWithProviders(<Loader />)

    const flexContainer = container.querySelector('.ant-flex')
    expect(flexContainer).toBeInTheDocument()
  })

  it('should have loader-container class', () => {
    const { container } = renderWithProviders(<Loader />)

    expect(container.firstChild).toHaveClass('ant-flex')
    expect(container.firstChild).toHaveClass('loader-container')
  })

  it('should render without errors', () => {
    expect(() => renderWithProviders(<Loader />)).not.toThrow()
  })

  it('should be visible in the document', () => {
    const { container } = renderWithProviders(<Loader />)

    expect(container.firstChild).toBeVisible()
  })

  it('should render spinning indicator', () => {
    const { container } = renderWithProviders(<Loader />)

    const spinIndicator = container.querySelector('.ant-spin-dot')
    expect(spinIndicator).toBeInTheDocument()
  })

  it('should apply justify center', () => {
    const { container } = renderWithProviders(<Loader />)

    const flexContainer = container.querySelector('.ant-flex')
    expect(flexContainer).toHaveClass('ant-flex-justify-center')
  })

  it('should apply align center', () => {
    const { container } = renderWithProviders(<Loader />)

    const flexContainer = container.querySelector('.ant-flex')
    expect(flexContainer).toHaveClass('ant-flex-align-center')
  })
})
