import React from 'react'
import { Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { AddBlogForm } from './components'
import '../shared/AdminTable.css'
import './AddBlog.css'

const { Title } = Typography

function AddBlog() {
  const { t } = useTranslation()

  return (
    <Flex vertical className="admin-add-blog">
      <Title level={1} className="admin-add-blog-title">
        {t('admin.addBlog.title')}
      </Title>
      <AddBlogForm />
    </Flex>
  )
}

export default AddBlog
