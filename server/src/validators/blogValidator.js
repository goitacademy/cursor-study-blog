export const validateBlogInput = (req, res, next) => {
  const { title, description, category } = req.body.blog ? JSON.parse(req.body.blog) : {}
  const errors = []

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters')
  }
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters')
  }
  if (!category) {
    errors.push('Category is required')
  }
  if (!req.file) {
    errors.push('Image is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

