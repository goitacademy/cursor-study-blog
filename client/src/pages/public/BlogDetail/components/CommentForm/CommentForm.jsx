import React from 'react'
import { Form, Input, Button, Typography, Flex, theme } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { commentSchema } from '@/utils/validationSchemas'
import './CommentForm.css'

const { Title } = Typography
const { TextArea } = Input

const MAX_COMMENT_LENGTH = 650

function CommentForm({ onSubmit, loading = false }) {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: '',
      content: ''
    }
  })

  const onSubmitHandler = async (data) => {
    const result = await onSubmit({
      name: data.name,
      content: data.content
    })

    if (result?.success) {
      reset()
    }
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

      <form onSubmit={handleSubmit(onSubmitHandler)} style={{ width: '100%' }}>
        <Form.Item
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name ? t(errors.name.message) : ''}
          style={{ marginBottom: token.marginSM }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={t('comment.namePlaceholder')}
                size="large"
                style={{
                  borderRadius: token.borderRadiusLG
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.content ? 'error' : ''}
          help={errors.content ? t(errors.content.message) : ''}
          style={{ marginBottom: token.marginSM }}
        >
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
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
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || isSubmitting}
            size="large"
            style={{
              borderRadius: token.borderRadiusLG
            }}
          >
            {t('common.submit')}
          </Button>
        </Form.Item>
      </form>
    </Flex>
  )
}

export default CommentForm
