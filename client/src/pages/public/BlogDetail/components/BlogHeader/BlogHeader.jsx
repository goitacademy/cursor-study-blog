import React from 'react'
import { Tag, Typography, Space, Image, Flex, theme } from 'antd'
import { DEFAULTS } from '@/constants/ui'
import './BlogHeader.css'

const { Title, Paragraph, Text } = Typography

function BlogHeader({ blog, author = DEFAULTS.AUTHOR }) {
  const { token } = theme.useToken()

  return (
    <Flex
      vertical
      align="center"
      gap={token.marginLG}
      style={{ width: '100%', maxWidth: 910 }}
    >
      {blog.image && (
        <Image
          src={blog.image}
          alt={blog.title}
          preview={false}
          style={{
            width: '100%',
            aspectRatio: '1280/720',
            objectFit: 'cover',
            borderRadius: 25
          }}
        />
      )}

      <Flex
        vertical
        gap={token.marginXS}
        style={{ width: '100%', padding: token.paddingXS }}
      >
        <Flex align="center" gap={token.marginLG}>
          <Text
            strong
            style={{
              fontSize: token.fontSizeLG,
              color: token.colorTextBase
          }}
        >
            {author}
        </Text>
          <Tag
            color="volcano"
            style={{
              fontSize: token.fontSizeLG,
              margin: 0,
              padding: `0 ${token.paddingXS}px`,
              lineHeight: '22px'
            }}
          >
            {blog.category}
          </Tag>
        </Flex>

        <Title
          level={1}
          style={{
            margin: 0,
            fontSize: token.fontSizeHeading1,
            fontWeight: token.fontWeightStrong,
            lineHeight: '46px',
            color: token.colorTextBase
          }}
        >
          {blog.title}
        </Title>

        {blog.subTitle && (
          <Paragraph
            style={{
              margin: 0,
              fontSize: token.fontSizeLG,
              lineHeight: '24px',
              color: token.colorTextBase
            }}
          >
            {blog.subTitle}
          </Paragraph>
        )}
      </Flex>
    </Flex>
  )
}

export default BlogHeader

