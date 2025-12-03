import React, { useState } from 'react'
import { Input, Button, Typography, theme } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { validateEmail } from '@/utils/validators'
import { LAYOUT } from '@/constants/ui'
import './NewsletterForm.css'

const { Title, Paragraph } = Typography

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      toast.error(t('messages.error.invalidEmail'))
      return
    }

    setLoading(true)

    setTimeout(() => {
      toast.success(t('newsletter.successMessage'))
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <div
      className="newsletter-form-section"
      style={{
        padding: `${token.paddingXL * 2}px ${token.paddingXL * 2}px`,
        background: token.colorPrimaryBg
      }}
    >
      <Title level={2} style={{ marginBottom: token.marginMD, color: token.colorText }}>
        {t('newsletter.title')}
      </Title>
      <Paragraph
        style={{
          fontSize: token.fontSizeLG,
          color: token.colorTextSecondary,
          marginBottom: token.marginXL
        }}
      >
        {t('newsletter.description')}
      </Paragraph>

      <div className="newsletter-form-container" style={{ maxWidth: LAYOUT.CARD_MAX_WIDTH }}>
        <Input.Search
          size="large"
          placeholder={t('newsletter.placeholder')}
          enterButton={
            <Button
              type="primary"
              loading={loading}
              icon={<MailOutlined />}
              style={{ height: token.controlHeightLG + 8 }}
            >
              {t('common.subscribe')}
            </Button>
          }
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onSearch={handleSubmit}
          styles={{
            input: {
              height: token.controlHeightLG + 8,
              fontSize: token.fontSizeLG
            }
          }}
        />
      </div>
    </div>
  )
}

export default NewsletterForm





