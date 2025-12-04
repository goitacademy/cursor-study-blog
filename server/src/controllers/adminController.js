import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js'
import User from '../models/User.js'
import { transformBlogImage, transformBlogsImages } from '../utils/imageUrl.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user by email
  const user = await User.findOne({ email, isActive: true })
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' })
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password)
  
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' })
  }

  // Create JWT with user info and expiration
  const token = jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      name: user.name,
      role: user.role 
    }, 
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  res.json({
    success: true, 
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 })
  res.json({
    success: true,
    count: blogs.length,
    blogs: transformBlogsImages(blogs, req)
  })
})

export const getDashboard = asyncHandler(async (req, res) => {
  const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(6).lean()
  
  // Transform image URLs for recent blogs
  const transformedBlogs = recentBlogs.map(blog => transformBlogImage(blog, req))
  
  const blogs = await Blog.countDocuments()
  const drafts = await Blog.countDocuments({ isPublished: false })

  const dashboardData = {
    blogs,
    drafts,
    recentBlogs: transformedBlogs
  }
  
  res.json({ success: true, dashboardData })
})
