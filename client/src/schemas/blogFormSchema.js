import { z } from 'zod'
import { UPLOAD } from '@/constants/ui'

const EMPTY_QUILL_HTML = new Set(['', '<p><br></p>', '<p></p>'])

const isEmptyQuillHtml = (html) => EMPTY_QUILL_HTML.has(html?.trim() ?? '')

export const createBlogFormSchema = (t) =>
  z.object({
    title: z.string().trim().min(1, t('validation.titleRequired')),
    subTitle: z.string().trim().min(1, t('validation.subtitleRequired')),
    category: z.string().min(1, t('validation.categoryRequired')),
    description: z
      .string()
      .refine((html) => !isEmptyQuillHtml(html), t('validation.descriptionRequired')),
    image: z
      .instanceof(File, { message: t('validation.thumbnailRequired') })
      .refine(
        (file) => file.type.startsWith('image/'),
        t('messages.error.imageType')
      )
      .refine(
        (file) => file.size / 1024 / 1024 < UPLOAD.MAX_SIZE_MB,
        t('messages.error.imageSize')
      )
  })
