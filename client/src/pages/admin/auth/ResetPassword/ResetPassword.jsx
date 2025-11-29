import React from 'react'
import { Form, Input, Button, Layout, Typography, Space, Flex } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'
import { assets } from '@/assets/assets'
import './ResetPassword.css'

const { Header, Footer, Content } = Layout
const { Title, Text, Paragraph } = Typography

function ResetPassword() {
  const { navigate } = useAppContext()
  const [loading, setLoading] = React.useState(false)
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      toast.success(t('auth.resetPassword.successMessage'))
      console.log('Reset password for:', values.email)

      setTimeout(() => {
        navigate(ROUTES.ADMIN)
      }, 2000)
    } catch (error) {
      toast.error(error.message || t('messages.error.passwordReset'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout className="auth-layout">
      <Header className="auth-header">
        <Flex
          align="center"
          gap={8}
          onClick={() => navigate(ROUTES.HOME)}
          className="auth-header-logo"
        >
          <img
            src={assets.sprint}
            alt={t('common.appName')}
            className="auth-header-logo-img"
          />
          <Title level={2} className="auth-header-logo-title">
            {t('common.appName')}
          </Title>
        </Flex>
      </Header>

      <Content className="auth-content">
        <Space direction="vertical" size={8} className="auth-card">
          <Title level={1} className="auth-card-title">
            {t('auth.resetPassword.title')}
          </Title>

          <Paragraph className="auth-card-description">
            {t('auth.resetPassword.description')}
          </Paragraph>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={<Text>{t('auth.login.emailLabel')}</Text>}
              name="email"
              rules={[
                { required: true, message: t('validation.emailRequired') },
                { type: 'email', message: t('validation.emailInvalid') }
              ]}
              className="auth-form-item"
            >
              <Input
                placeholder={t('auth.login.emailPlaceholder')}
                suffix={<MailOutlined className="auth-input-icon" />}
                size="large"
              />
            </Form.Item>

            <Form.Item className="auth-form-item-small">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                size="large"
              >
                {t('auth.resetPassword.submitButton')}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Content>

      <Footer className="auth-footer">
        <Flex
          align="center"
          gap={8}
          onClick={() => navigate(ROUTES.HOME)}
          className="auth-footer-logo"
        >
          <img
            src={assets.sprint}
            alt={t('common.appName')}
            className="auth-footer-logo-img"
          />
          <Title level={3} className="auth-footer-logo-title">
            {t('common.appName')}
          </Title>
        </Flex>
        <Text>{t('common.copyright')}</Text>
      </Footer>
    </Layout>
  )
}

export default ResetPassword
