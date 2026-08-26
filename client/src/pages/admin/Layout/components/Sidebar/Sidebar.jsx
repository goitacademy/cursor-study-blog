import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, Flex, Button } from 'antd'
import { AppstoreOutlined, PlusOutlined, UnorderedListOutlined, CommentOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/constants/routes'
import { useAppContext } from '@/context/AppContext'
import './Sidebar.css'

function Sidebar() {
  const location = useLocation()
  const { navigate } = useAppContext()
  const { t } = useTranslation()

  const menuItems = [
    {
      key: ROUTES.ADMIN_DASHBOARD,
      icon: <AppstoreOutlined />,
      label: <NavLink to={ROUTES.ADMIN_DASHBOARD}>{t('admin.sidebar.dashboard')}</NavLink>,
    },
    {
      key: ROUTES.ADMIN_ADD_BLOG,
      icon: <PlusOutlined />,
      label: <NavLink to={ROUTES.ADMIN_ADD_BLOG}>{t('admin.sidebar.addArticle')}</NavLink>,
    },
    {
      key: ROUTES.ADMIN_ARTICLES,
      icon: <UnorderedListOutlined />,
      label: <NavLink to={ROUTES.ADMIN_ARTICLES}>{t('admin.sidebar.allArticles')}</NavLink>,
    },
    {
      key: ROUTES.ADMIN_COMMENTS,
      icon: <CommentOutlined />,
      label: <NavLink to={ROUTES.ADMIN_COMMENTS}>{t('admin.sidebar.comments')}</NavLink>,
    },
  ]

  const getSelectedKey = () => {
    if (location.pathname === ROUTES.ADMIN || location.pathname === ROUTES.ADMIN + '/') {
      return ROUTES.ADMIN_DASHBOARD
    }
    return location.pathname
  }

  return (
    <Flex vertical justify="space-between" className="admin-sidebar">
      <div className="admin-sidebar-menu">
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          theme="light"
        />
      </div>

      <div className="admin-sidebar-footer">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.ADMIN_ADD_BLOG)}
          className="admin-sidebar-add-btn"
          block
        >
          {t('admin.sidebar.addArticle')}
        </Button>
      </div>
    </Flex>
  )
}

export default Sidebar
