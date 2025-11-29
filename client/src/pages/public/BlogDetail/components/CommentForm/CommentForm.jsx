import React, { useState } from 'react'
import { Form, Input, Button, Typography, Flex, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import './CommentForm.css'

const { Title } = Typography
const { TextArea } = Input

const MAX_COMMENT_LENGTH = 650

function CommentForm({ onSubmit, loading = false }) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    setSubmitting(true)

    const result = await onSubmit({
      name: values.name,
      content: values.content
    })

    if (result?.success) {
      form.resetFields()
    }

    setSubmitting(false)
  }

  return (
    <Flex
      vertical
      gap={token.marginXS}
      style={{ width: '100%' }}
    >
      <Title
        level={3}
        style={{
          margin: 0,
          marginBottom: token.marginXS,
          fontWeight: token.fontWeightStrong,
          color: token.colorTextBase
        }}
      >
        {t('comment.title')}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ width: '100%' }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: t('validation.nameRequired') }]}
          style={{ marginBottom: token.marginSM }}
        >
          <Input
            placeholder={t('comment.namePlaceholder')}
            size="large"
            style={{
              borderRadius: token.borderRadiusLG
            }}
          />
        </Form.Item>

        <Form.Item
          name="content"
          rules={[{ required: true, message: t('validation.commentRequired') }]}
          style={{ marginBottom: token.marginSM }}
        >
          <TextArea
            placeholder={t('comment.contentPlaceholder')}
            rows={5}
            size="large"
            maxLength={MAX_COMMENT_LENGTH}
            showCount={{
              formatter: ({ count, maxLength }) => `${count}/${maxLength}`
            }}
            style={{
              borderRadius: token.borderRadiusLG
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || submitting}
            size="large"
            style={{
              borderRadius: token.borderRadiusLG
            }}
          >
            {t('common.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default CommentForm
