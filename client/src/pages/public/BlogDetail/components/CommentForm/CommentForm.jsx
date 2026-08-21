import React from 'react'
import { Form, Input, Button, Typography, Flex, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { COMMENT } from '@/constants/ui'
import { createCommentFormSchema } from '@/schemas'
import './CommentForm.css'

const { Title } = Typography
const { TextArea } = Input

function CommentForm({ onSubmit, loading = false }) {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(createCommentFormSchema(t)),
    defaultValues: {
      name: '',
      content: ''
    }
  })

  const handleFormSubmit = async (values) => {
    const result = await onSubmit({
      name: values.name,
      content: values.content
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

      <Form
        layout="vertical"
        onSubmitCapture={handleSubmit(handleFormSubmit)}
        style={{ width: '100%' }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
              style={{ marginBottom: token.marginSM }}
            >
              <Input
                {...field}
                placeholder={t('comment.namePlaceholder')}
                size="large"
                style={{
                  borderRadius: token.borderRadiusLG
                }}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
              style={{ marginBottom: token.marginSM }}
            >
              <TextArea
                {...field}
                placeholder={t('comment.contentPlaceholder')}
                rows={5}
                size="large"
                maxLength={COMMENT.MAX_LENGTH}
                showCount={{
                  formatter: ({ count, maxLength }) => `${count}/${maxLength}`
                }}
                style={{
                  borderRadius: token.borderRadiusLG
                }}
              />
            </Form.Item>
          )}
        />

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
      </Form>
    </Flex>
  )
}

export default CommentForm
