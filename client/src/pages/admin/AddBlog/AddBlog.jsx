import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, Select, Upload, Button, Typography, Flex, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { UPLOAD, DEFAULTS } from '@/constants/ui'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import '../shared/AdminTable.css'
import './AddBlog.css'

const { Title, Text } = Typography
const { TextArea } = Input

function AddBlog() {
  const [form] = Form.useForm()
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const { t } = useTranslation()

  const [image, setImage] = useState(null)
  const [fileList, setFileList] = useState([])
  const [imagePreview, setImagePreview] = useState(null)

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const handleGenerateContent = async () => {
    const title = form.getFieldValue('title')
    if (!title) {
      toast.error(t('messages.error.blogTitle'))
      return
    }

    const result = await generateContent(title)
    if (result.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
    }
  }

  const onSubmitHandler = async (values) => {
    if (!quillRef.current) return

    const description = quillRef.current.root.innerHTML
    if (!description || description.trim() === '<p><br></p>' || description.trim() === '') {
      toast.error(t('messages.error.blogDescription'))
      return
    }

    if (!image) {
      toast.error(t('messages.error.blogThumbnail'))
      return
    }

    const blog = {
      title: values.title,
      subTitle: values.subTitle,
      description,
      category: values.category,
      isPublished: true
    }

    const result = await createBlog(blog, image)

    if (result.success) {
      form.resetFields()
      setImage(null)
      setFileList([])
      setImagePreview(null)
      quillRef.current.root.innerHTML = ''
    }
  }

  const handleSaveDraft = async () => {
    const values = form.getFieldsValue()

    if (!values.title) {
      toast.error(t('messages.error.blogTitleMin'))
      return
    }

    if (!quillRef.current) return

    const description = quillRef.current.root.innerHTML || '<p><br></p>'

    const blog = {
      title: values.title,
      subTitle: values.subTitle || '',
      description,
      category: values.category || DEFAULTS.CATEGORY,
      isPublished: false
    }

    const result = await createBlog(blog, image)

    if (result.success) {
      form.resetFields()
      setImage(null)
      setFileList([])
      setImagePreview(null)
      quillRef.current.root.innerHTML = ''
    }
  }

  const uploadProps = {
    beforeUpload: (file) => {
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

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      setImage(file)
      setFileList([file])
      return false
    },
    onRemove: () => {
      setImage(null)
      setFileList([])
      setImagePreview(null)
    },
    fileList,
    maxCount: 1,
    accept: UPLOAD.ACCEPTED_TYPES,
    showUploadList: false
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: t('admin.addBlog.titlePlaceholder')
      })
    }
  }, [t])

  return (
    <Flex vertical className="admin-add-blog">
      <Title level={1} className="admin-add-blog-title">
        {t('admin.addBlog.title')}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmitHandler}
        initialValues={{ category: DEFAULTS.CATEGORY }}
        className="admin-add-blog-form"
      >
        <Form.Item
          label={t('admin.addBlog.uploadThumbnail')}
        >
          <Upload {...uploadProps} listType="picture-card" className="admin-upload">
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

        <Form.Item
          label={t('admin.addBlog.titleLabel')}
          name="title"
          rules={[{ required: true, message: t('validation.titleRequired') }]}
        >
          <Input placeholder={t('admin.addBlog.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.subtitleLabel')}
          name="subTitle"
          rules={[{ required: true, message: t('validation.subtitleRequired') }]}
        >
          <Input placeholder={t('admin.addBlog.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.categoryLabel')}
          name="category"
          rules={[{ required: true, message: t('validation.categoryRequired') }]}
        >
          <Select placeholder={t('admin.addBlog.categoryPlaceholder')}>
            {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.bodyLabel')}
          required
        >
          <div className="admin-editor-wrapper">
            <div
              ref={editorRef}
              className="admin-editor"
            />
            <Button
              size="small"
              onClick={handleGenerateContent}
              loading={isGenerating}
              disabled={isGenerating || isCreating}
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
              disabled={isCreating || isGenerating}
            >
              {t('admin.addBlog.publishButton')}
            </Button>
            <Button
              onClick={handleSaveDraft}
              loading={isCreating}
              disabled={isCreating || isGenerating}
              className="admin-draft-button"
            >
              {t('admin.addBlog.saveDraft')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default AddBlog
