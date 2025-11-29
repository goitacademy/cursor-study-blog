import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import {
  Home,
  BlogDetail,
  AdminLayout,
  Dashboard,
  AddBlog,
  Articles,
  Comments,
  Login,
  Register,
  ResetPassword
} from '@/pages'
import { useAppContext } from '@/context/AppContext'
import { Toaster } from 'react-hot-toast'
import { ROUTES } from '@/constants/routes'
import 'quill/dist/quill.snow.css'

const theme = {
  cssVar: true,
  token: {
    colorPrimary: '#fa541c',
    colorLink: '#fa541c',
    colorLinkHover: '#ff7a45',
    borderRadius: 6,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
    Menu: {
      itemBorderRadius: 6,
    },
    Table: {
      borderRadius: 8,
    },
    Tabs: {
      cardBorderRadius: 8,
    },
  },
}

function App() {
  const { token } = useAppContext()

  return (
    <ConfigProvider theme={theme}>
      <Toaster />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.BLOG_DETAIL} element={<BlogDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path={ROUTES.ADMIN} element={token ? <AdminLayout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='articles' element={<Articles />} />
          <Route path='comments' element={<Comments />} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}

export default App
