import React from 'react'
import { Flex, Button, Typography, Space, theme } from 'antd'
import { FacebookOutlined, TwitterOutlined, GooglePlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { LAYOUT } from '@/constants/ui'
import './SocialShare.css'

const { Text } = Typography

function SocialShare() {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  return (
    <Space
      direction="vertical"
      size="middle"
      className="social-share"
      style={{
        maxWidth: LAYOUT.CONTENT_MAX_WIDTH - 100,
        margin: `${token.marginXL * 6}px auto`,
        padding: `0 ${token.paddingLG}px`
      }}
    >
      <Text strong>{t('blogDetail.shareTitle')}</Text>
      <Flex gap="small">
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<FacebookOutlined style={{ fontSize: token.fontSizeHeading4 }} />}
          aria-label={t('footer.facebook')}
        />
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<TwitterOutlined style={{ fontSize: token.fontSizeHeading4 }} />}
          aria-label={t('footer.twitter')}
        />
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<GooglePlusOutlined style={{ fontSize: token.fontSizeHeading4 }} />}
          aria-label="Google Plus"
        />
      </Flex>
    </Space>
  )
}

export default SocialShare

