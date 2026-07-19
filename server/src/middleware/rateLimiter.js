import rateLimit from 'express-rate-limit'

// Rate limiter for login attempts - stricter limits
const isDev = process.env.NODE_ENV === 'development'
const loginWindowMs = isDev ? 60 * 1000 : 15 * 60 * 1000
const loginMaxAttempts = isDev ? 50 : 5

export const loginLimiter = rateLimit({
  windowMs: loginWindowMs,
  max: loginMaxAttempts,
  skipSuccessfulRequests: true, // don't penalize users once they enter valid credentials
  message: {
    success: false,
    message: isDev
      ? 'Too many login attempts. Please try again in 1 minute.'
      : 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter for comment submissions - prevent spam
export const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 comments per minute
  message: {
    success: false,
    message: 'Too many comments submitted. Please wait a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter for AI content generation - prevent abuse
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 generations per minute
  message: {
    success: false,
    message: 'Too many generation requests. Please wait a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    message: 'Too many requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

