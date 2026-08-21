import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, Select, Upload, Button, Typography, Flex, Space, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { UPLOAD, DEFAULTS } from '@/constants/ui'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import { createBlogFormSchema } from '@/schemas'

const { Text } = Typography

const defaultValues = {
  title: '',
  subTitle: '',
  category: DEFAULTS.CATEGORY,
  description: '',
  image: null
}

function AddBlogForm() {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const skipDescriptionSyncRef = useRef(false)
  const { t } = useTranslation()
  const [imagePreview, setImagePreview] = useState(null)

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()
  const isBusy = isGenerating || isCreating

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createBlogFormSchema(t)),
    defaultValues
  })

  const image = watch('image')

  const resetForm = () => {
    skipDescriptionSyncRef.current = true
    if (quillRef.current) {
      quillRef.current.root.innerHTML = ''
    }
    reset(defaultValues)
    setImagePreview(null)
    skipDescriptionSyncRef.current = false
  }

  const submitBlog = async (values, isPublished) => {
    const blog = {
      title: values.title,
      subTitle: values.subTitle,
      description: values.description,
      category: values.category,
      isPublished
    }

    const result = await createBlog(blog, values.image)
    if (result.success) {
      resetForm()
    }
  }

  const handleGenerateContent = async () => {
    const isTitleValid = await trigger('title')
    if (!isTitleValid) {
      toast.error(t('messages.error.blogTitle'))
      return
    }

    const result = await generateContent(getValues('title'))
    if (result.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
      setValue('description', result.content, { shouldValidate: true, shouldDirty: true })
    }
  }

  useEffect(() => {
    if (!(image instanceof File)) {
      setImagePreview(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(image)
  }, [image])

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: t('admin.addBlog.titlePlaceholder')
      })

      quillRef.current.on('text-change', () => {
        if (skipDescriptionSyncRef.current) return
        setValue('description', quillRef.current.root.innerHTML, {
          shouldDirty: true,
          shouldValidate: true
        })
      })
    }
  }, [t, setValue])

  useEffect(() => {
    if (!quillRef.current) return
    quillRef.current.enable(!isBusy)
  }, [isBusy])

  return (
    <Spin spinning={isGenerating} description={t('common.loading')}>
      <Form
        layout="vertical"
        disabled={isBusy}
        className="admin-add-blog-form"
        onSubmitCapture={handleSubmit((values) => submitBlog(values, true))}
      >
        <Controller
          name="image"
          control={control}
          render={({ field: { value, onChange }, fieldState }) => (
            <Form.Item
              label={t('admin.addBlog.uploadThumbnail')}
              required
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Upload
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/')
                  if (!isImage) {
                    toast.error(t('messages.error.imageType'))
                    return false
                  }
                  const isLt5M = file.size / 1024 / 1024 < UPLOAD.MAX_SIZE_MB
                  if (!isLt5M) {
                    toast.error(t('messages.error.imageSize'))
                    return false
                  }

                  onChange(file)
                  return false
                }}
                onRemove={() => onChange(null)}
                fileList={value ? [value] : []}
                maxCount={1}
                accept={UPLOAD.ACCEPTED_TYPES}
                showUploadList={false}
                listType="picture-card"
                className="admin-upload"
                disabled={isBusy}
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
            </Form.Item>
          )}
        />

        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label={t('admin.addBlog.titleLabel')}
              required
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input {...field} placeholder={t('admin.addBlog.titlePlaceholder')} />
            </Form.Item>
          )}
        />

        <Controller
          name="subTitle"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label={t('admin.addBlog.subtitleLabel')}
              required
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input {...field} placeholder={t('admin.addBlog.titlePlaceholder')} />
            </Form.Item>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label={t('admin.addBlog.categoryLabel')}
              required
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Select {...field} placeholder={t('admin.addBlog.categoryPlaceholder')}>
                {BLOG_CATEGORIES.filter((cat) => cat !== 'All').map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        />

        <Form.Item
          label={t('admin.addBlog.bodyLabel')}
          required
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <div className="admin-editor-wrapper">
            <div ref={editorRef} className="admin-editor" />
            <Button
              size="small"
              htmlType="button"
              onClick={handleGenerateContent}
              loading={isGenerating}
              disabled={isBusy}
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
              loading={isCreating}
              disabled={isBusy}
            >
              {t('admin.addBlog.publishButton')}
            </Button>
            <Button
              htmlType="button"
              onClick={handleSubmit((values) => submitBlog(values, false))}
              loading={isCreating}
              disabled={isBusy}
              className="admin-draft-button"
            >
              {t('admin.addBlog.saveDraft')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default AddBlogForm
