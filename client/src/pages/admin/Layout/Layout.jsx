import React from 'react'
import { Outlet } from 'react-router-dom'
import { Button, Layout as AntLayout, Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { LAYOUT } from '@/constants/ui'
import { assets } from '@/assets/assets'
import toast from 'react-hot-toast'
import { Sidebar } from './components'
import './Layout.css'

const { Header, Sider, Content } = AntLayout
const { Title, Text } = Typography

function Layout() {
  const { setToken, navigate } = useAppContext()
  const { t } = useTranslation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate(ROUTES.HOME)
    toast.success(t('messages.success.logout'))
  }

  return (
    <AntLayout className="admin-layout">
      <Header className="admin-header">
        <Flex justify="space-between" align="center" className="admin-header-content">
          <Flex
            align="center"
            gap={8}
            onClick={() => navigate(ROUTES.HOME)}
            className="admin-header-logo"
          >
            <img
              src={assets.sprint}
              alt={t('common.appName')}
              className="admin-header-logo-img"
            />
            <Title level={3} className="admin-header-logo-title">
              {t('common.appName')}
            </Title>
          </Flex>

          <Button onClick={handleLogout} className="admin-logout-btn">
            {t('nav.logout')}
          </Button>
        </Flex>
      </Header>

      <AntLayout className="admin-content-layout">
        <Sider
          width={LAYOUT.SIDEBAR_WIDTH}
          className="admin-sider"
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Sidebar />
        </Sider>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </AntLayout>

      <Flex justify="space-between" align="center" className="admin-footer">
        <Flex align="center" gap={8}>
          <img
            src={assets.sprint}
            alt={t('common.appName')}
            className="admin-footer-logo-img"
          />
          <Text strong>{t('common.appName')}</Text>
        </Flex>
        <Text type="secondary">{t('common.copyright')}</Text>
      </Flex>
    </AntLayout>
  )
}

export default Layout
