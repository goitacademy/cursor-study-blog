import React from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Typography, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { Navbar, Footer, Loader } from '@/components'
import { useBlog, useComments } from '@/hooks'
import { BlogHeader, BlogContent, CommentList, CommentForm } from './components'
import { LAYOUT } from '@/constants/ui'

const { Title } = Typography

function BlogDetail() {
  const { id } = useParams()
  const { blog, loading: blogLoading } = useBlog(id)
  const { comments, addComment } = useComments(id)
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const handleAddComment = async (commentData) => {
    return await addComment({
      blog: id,
      name: commentData.name,
      content: commentData.content
    })
  }

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

        <Flex
          vertical
          align="center"
          gap={token.marginLG}
          style={{ width: '100%', maxWidth: 1376, padding: `0 ${token.paddingLG}px` }}
        >
          <Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: 0,
              fontWeight: token.fontWeightStrong
            }}
          >
            {t('blog.comments')}
          </Title>

          <Flex
            vertical
            align="center"
            gap={token.marginLG}
            style={{ width: '100%', maxWidth: LAYOUT.COMMENTS_MAX_WIDTH }}
          >
            <CommentForm onSubmit={handleAddComment} />

            <CommentList comments={comments} />
          </Flex>
        </Flex>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default BlogDetail

