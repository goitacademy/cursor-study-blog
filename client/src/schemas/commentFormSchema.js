import { z } from 'zod'
import { COMMENT } from '@/constants/ui'

export const createCommentFormSchema = (t) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t('validation.nameRequired'))
      .min(2, t('validation.nameMin')),
    content: z
      .string()
      .trim()
      .min(1, t('validation.commentRequired'))
      .min(COMMENT.MIN_LENGTH, t('validation.commentMin', { min: COMMENT.MIN_LENGTH }))
      .max(COMMENT.MAX_LENGTH, t('validation.commentMax', { max: COMMENT.MAX_LENGTH }))
  })
