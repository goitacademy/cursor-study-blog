import React from 'react'
import { Avatar, Typography, Space, Empty, Flex, theme } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { DATE_FORMATS } from '@/constants/ui'
import './CommentList.css'

const { Text } = Typography

function CommentList({ comments }) {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  if (comments.length === 0) {
    return <Empty description={t('comment.noComments')} />
  }

  return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {comments.map((comment) => (
        <Flex
              key={comment._id}
          gap={token.marginMD}
          align="flex-start"
              style={{
                background: token.colorPrimaryBg,
                borderRadius: 16,
                padding: token.padding
              }}
            >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{ 
                    background: token.colorTextPlaceholder,
                    flexShrink: 0
                  }}
                />
                <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                  <Flex justify="space-between" align="center">
              <Text
                strong
                style={{
                  fontSize: token.fontSize,
                  color: token.colorTextBase
                }}
              >
                      {comment.name}
                    </Text>
              <Text
                strong
                style={{
                  fontSize: token.fontSize,
                  color: token.colorTextBase
                }}
              >
                      {moment(comment.createdAt).format(DATE_FORMATS.DISPLAY)}
                    </Text>
                  </Flex>
            <Text
              style={{
                fontSize: token.fontSizeLG,
                marginTop: token.marginXS,
                color: token.colorTextBase
              }}
            >
                    {comment.content}
                  </Text>
                </Flex>
              </Flex>
          ))}
        </Space>
  )
}

export default CommentList
