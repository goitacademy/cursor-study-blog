import { useState } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useBlogActions() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const { axios } = useAppContext()
  const { mutate, error } = useApiMutation()

  const deleteBlog = async (blogId) => {
    setIsDeleting(true)
    
    const result = await mutate(
      () => axios.post('/api/blog/delete', { id: blogId }),
      {
        confirmMessage: 'Are you sure you want to delete this blog?',
        successMessage: MESSAGES.SUCCESS_BLOG_DELETED,
        errorMessage: MESSAGES.ERROR_DELETE_BLOG
      }
    )
    
    setIsDeleting(false)
    return result
  }

  const publishBlog = async (blogId) => {
    setIsPublishing(true)
    
    const result = await mutate(
      () => axios.post('/api/blog/publish', { id: blogId }),
      {
        successMessage: 'Blog published successfully',
        errorMessage: MESSAGES.ERROR_UPDATE_BLOG
      }
    )
    
    setIsPublishing(false)
    return result
  }

  const unpublishBlog = async (blogId) => {
    setIsPublishing(true)
    
    const result = await mutate(
      () => axios.post('/api/blog/unpublish', { id: blogId }),
      {
        successMessage: 'Blog unpublished successfully',
        errorMessage: MESSAGES.ERROR_UPDATE_BLOG
      }
    )
    
    setIsPublishing(false)
    return result
  }

  return {
    deleteBlog,
    publishBlog,
    unpublishBlog,
    isDeleting,
    isPublishing,
    inProgress: isDeleting || isPublishing,
    error
  }
}

