import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, Select, Upload, Button, Typography, Flex, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import Quill from 'quill'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { UPLOAD, DEFAULTS } from '@/constants/ui'
import { blogSchema, blogDraftSchema } from '@/utils/validationSchemas'
import './BlogForm.css'

const { Text } = Typography

function BlogForm({ onSubmit, onSaveDraft, onGenerateContent, isLoading = false }) {
  const { t } = useTranslation()
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDraftMode, setIsDraftMode] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(isDraftMode ? blogDraftSchema : blogSchema),
    defaultValues: {
      title: '',
      subTitle: '',
      category: DEFAULTS.CATEGORY,
      description: '',
      image: null
    },
    mode: 'onSubmit'
  })

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: t('admin.addBlog.titlePlaceholder')
      })

      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML
        setValue('description', html, { shouldValidate: false })
      })
    }
  }, [t, setValue])

  const handlePublish = async (data) => {
    setIsDraftMode(false)
    const result = await onSubmit({
      title: data.title,
      subTitle: data.subTitle,
      category: data.category,
      description: data.description,
      isPublished: true
    }, data.image)

    if (result?.success) {
      resetForm()
    }
  }

  const handleDraft = async () => {
    setIsDraftMode(true)
    const values = getValues()

    const result = await onSaveDraft({
      title: values.title || '',
      subTitle: values.subTitle || '',
      category: values.category || DEFAULTS.CATEGORY,
      description: values.description || '<p><br></p>',
      isPublished: false
    }, values.image)

    if (result?.success) {
      resetForm()
    }
  }

  const handleGenerateAI = async () => {
    const title = getValues('title')
    const result = await onGenerateContent(title)
    if (result?.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
      setValue('description', result.content, { shouldValidate: false })
    }
  }

  const resetForm = () => {
    reset()
    setImagePreview(null)
    if (quillRef.current) {
      quillRef.current.root.innerHTML = ''
    }
  }

  const handleImageChange = (file, onChange) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
    onChange(file)
  }

  const handleImageRemove = (onChange) => {
    setImagePreview(null)
    onChange(null)
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(handlePublish)} className="admin-add-blog-form">
      <Form.Item
        label={t('admin.addBlog.uploadThumbnail')}
        validateStatus={errors.image ? 'error' : ''}
        help={errors.image ? t(errors.image.message) : ''}
      >
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Upload
              listType="picture-card"
              className="admin-upload"
              beforeUpload={(file) => {
                handleImageChange(file, onChange)
                return false
              }}
              onRemove={() => handleImageRemove(onChange)}
              fileList={value ? [{ uid: '-1', name: value.name, status: 'done' }] : []}
              maxCount={1}
              accept={UPLOAD.ACCEPTED_TYPES}
              showUploadList={false}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="admin-upload-preview"
                />
              ) : (
                <Flex vertical align="center" justify="center">
                  <PlusOutlined />
                  <Text className="admin-upload-text">{t('admin.addBlog.uploadButton')}</Text>
                </Flex>
              )}
            </Upload>
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.titleLabel')}
        validateStatus={errors.title ? 'error' : ''}
        help={errors.title ? t(errors.title.message) : ''}
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder={t('admin.addBlog.titlePlaceholder')} />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.subtitleLabel')}
        validateStatus={errors.subTitle ? 'error' : ''}
        help={errors.subTitle ? t(errors.subTitle.message) : ''}
      >
        <Controller
          name="subTitle"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder={t('admin.addBlog.titlePlaceholder')} />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.categoryLabel')}
        validateStatus={errors.category ? 'error' : ''}
        help={errors.category ? t(errors.category.message) : ''}
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder={t('admin.addBlog.categoryPlaceholder')}>
              {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('admin.addBlog.bodyLabel')}
        required
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description ? t(errors.description.message) : ''}
      >
        <div className="admin-editor-wrapper">
          <div
            ref={editorRef}
            className="admin-editor"
          />
          <Button
            size="small"
            onClick={handleGenerateAI}
            loading={isLoading}
            disabled={isLoading || isSubmitting}
            className="admin-editor-ai-button"
          >
            {t('admin.addBlog.generateAI')}
          </Button>
        </div>
      </Form.Item>

      <Form.Item className="admin-form-actions-item">
        <Space size="middle">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            {t('admin.addBlog.publishButton')}
          </Button>
          <Button
            onClick={handleDraft}
            loading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
            className="admin-draft-button"
          >
            {t('admin.addBlog.saveDraft')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default BlogForm

