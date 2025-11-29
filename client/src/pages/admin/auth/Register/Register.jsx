import React from 'react'
import { Form, Input, Button, Layout, Typography, Space, Flex } from 'antd'
import { MailOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'
import { assets } from '@/assets/assets'
import './Register.css'

const { Header, Footer, Content } = Layout
const { Title, Text, Link } = Typography

function Register() {
  const { navigate } = useAppContext()
  const [loading, setLoading] = React.useState(false)
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      toast.info(t('messages.info.registrationComingSoon'))
      console.log('Register values:', values)
    } catch (error) {
      toast.error(error.message || t('messages.error.registration'))
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
            {t('auth.register.title')}
          </Title>

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

            <Form.Item
              label={<Text>{t('auth.login.passwordLabel')}</Text>}
              name="password"
              rules={[
                { required: true, message: t('validation.passwordRequired') },
                { min: 6, message: t('validation.passwordMin') }
              ]}
              className="auth-form-item"
            >
              <Input.Password
                placeholder={t('auth.login.passwordPlaceholder')}
                iconRender={visible => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<Text>{t('auth.register.repeatPasswordLabel')}</Text>}
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: t('validation.confirmPasswordRequired') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error(t('validation.passwordMismatch')))
                  },
                }),
              ]}
              className="auth-form-item"
            >
              <Input.Password
                placeholder={t('auth.login.passwordPlaceholder')}
                iconRender={visible => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
                {t('auth.register.submitButton')}
              </Button>
            </Form.Item>
          </Form>

          <Flex justify="center">
            <Text>
              {t('auth.register.hasAccount')}{' '}
              <Link
                onClick={() => navigate(ROUTES.ADMIN)}
                className="auth-link-warning"
              >
                {t('auth.register.login')}
              </Link>
            </Text>
          </Flex>
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

export default Register
