import { z } from 'zod'
import { BLOG_CATEGORIES } from '@/constants/categories'

const MAX_COMMENT_LENGTH = 650
const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// Helper to check if Quill content is empty
const isQuillEmpty = (html) => {
  if (!html) return true
  const trimmed = html.trim()
  return trimmed === '' || trimmed === '<p><br></p>' || trimmed === '<p></p>'
}

// Comment Form Schema
export const commentSchema = z.object({
  name: z
    .string()
    .min(1, 'validation.nameRequired')
    .min(2, 'validation.nameMin')
    .max(50, 'validation.nameMax'),
  content: z
    .string()
    .min(1, 'validation.commentRequired')
    .min(10, 'validation.commentMin')
    .max(MAX_COMMENT_LENGTH, 'validation.commentMax')
})

// Blog Form Schema - Full validation for publishing
export const blogSchema = z.object({
  title: z
    .string()
    .min(1, 'validation.titleRequired')
    .min(5, 'validation.titleMin')
    .max(200, 'validation.titleMax'),
  subTitle: z
    .string()
    .min(1, 'validation.subtitleRequired')
    .min(10, 'validation.subtitleMin')
    .max(300, 'validation.subtitleMax'),
  category: z
    .string()
    .min(1, 'validation.categoryRequired')
    .refine(
      (val) => BLOG_CATEGORIES.filter(cat => cat !== 'All').includes(val),
      'validation.categoryRequired'
    ),
  description: z
    .string()
    .min(1, 'validation.descriptionRequired')
    .refine((val) => !isQuillEmpty(val), 'validation.descriptionRequired'),
  image: z
    .custom()
    .refine((file) => file !== null && file !== undefined, 'validation.imageRequired')
    .refine(
      (file) => {
        if (!file) return false
        return file.size <= MAX_FILE_SIZE_BYTES
      },
      'messages.error.imageSize'
    )
    .refine(
      (file) => {
        if (!file) return false
        return ACCEPTED_IMAGE_TYPES.includes(file.type)
      },
      'messages.error.imageType'
    )
})

// Blog Form Schema - Minimal validation for draft
export const blogDraftSchema = z.object({
  title: z
    .string()
    .min(1, 'validation.titleRequired')
    .min(5, 'validation.titleMin')
    .max(200, 'validation.titleMax'),
  subTitle: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  image: z
    .custom()
    .optional()
    .refine(
      (file) => {
        if (!file) return true
        return file.size <= MAX_FILE_SIZE_BYTES
      },
      'messages.error.imageSize'
    )
    .refine(
      (file) => {
        if (!file) return true
        return ACCEPTED_IMAGE_TYPES.includes(file.type)
      },
      'messages.error.imageType'
    )
})

