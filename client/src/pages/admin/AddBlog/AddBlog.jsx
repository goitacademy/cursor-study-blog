import React from 'react'
import { Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import BlogForm from './components/BlogForm'
import '../shared/AdminTable.css'
import './AddBlog.css'

const { Title } = Typography

function AddBlog() {
  const { t } = useTranslation()
  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const handleGenerateContent = async (title) => {
    if (!title) {
      toast.error(t('messages.error.blogTitle'))
      return { success: false }
    }

    const result = await generateContent(title)
    return result
  }

  const handlePublish = async (blog, image) => {
    if (!image) {
      toast.error(t('messages.error.blogThumbnail'))
      return { success: false }
    }

    const result = await createBlog(blog, image)
    return result
  }

  const handleSaveDraft = async (blog, image) => {
    const result = await createBlog(blog, image)
    return result
  }

  return (
    <Flex vertical className="admin-add-blog">
      <Title level={1} className="admin-add-blog-title">
        {t('admin.addBlog.title')}
      </Title>

      <BlogForm
        onSubmit={handlePublish}
        onSaveDraft={handleSaveDraft}
        onGenerateContent={handleGenerateContent}
        isLoading={isCreating || isGenerating}
      />
    </Flex>
  )
}

export default AddBlog
