import React from 'react'
import { useParams } from 'react-router-dom'
import { Flex, theme } from 'antd'
import { Navbar, Footer, Loader } from '@/components'
import { useBlog } from '@/hooks'
import { BlogHeader, BlogContent } from './components'

function BlogDetail() {
  const { id } = useParams()
  const { blog, loading: blogLoading } = useBlog(id)
  const { token } = theme.useToken()

  if (blogLoading || !blog) {
    return <Loader />
  }

  return (
    <Flex
      vertical
      style={{ background: token.colorBgBase, minHeight: '100vh' }}
    >
      <Navbar />

      <Flex
        vertical
        align="center"
        gap={token.marginXL * 2}
        style={{ flex: 1, padding: `${token.marginXL * 2}px 0` }}
      >
        <Flex
          vertical
          align="center"
          gap={token.marginXL}
          style={{ width: '100%', maxWidth: 1376, padding: `0 ${token.paddingLG}px` }}
        >
          <BlogHeader blog={blog} />

          <BlogContent content={blog.description} />
        </Flex>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default BlogDetail

