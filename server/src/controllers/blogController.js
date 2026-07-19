import fs from 'fs'
import path from 'path'
import Groq from 'groq-sdk'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { transformBlogImage, transformBlogsImages } from '../utils/imageUrl.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

// Инициализация Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const getImagePath = (filename) => `/uploads/blogs/${filename}`

const deleteImageFile = (imagePath) => {
  if (!imagePath) return
  const filename = imagePath.split('/').pop()
  const fullPath = path.join(process.cwd(), 'uploads', 'blogs', filename)
  if (fs.existsSync(fullPath)) {
    try { fs.unlinkSync(fullPath) } catch (err) { console.error('Delete error:', err) }
  }
}

// ЭКСПОРТ addBlog
export const addBlog = asyncHandler(async (req, res) => {
  const blogData = req.body.blog ? JSON.parse(req.body.blog) : {}
  const { title, subTitle, description, category, isPublished } = blogData
  const image = getImagePath(req.file.filename)
  const blog = await Blog.create({
    title, subTitle, description, category, image, isPublished,
    author: req.user.userId, authorName: req.user.name
  })
  res.status(201).json({ success: true, blog: transformBlogImage(blog, req) })
})

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isPublished: true })
  res.json({ success: true, blogs: transformBlogsImages(blogs, req) })
})

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.blogId)
  if (!blog) return res.status(404).json({ success: false })
  res.json({ success: true, blog: transformBlogImage(blog, req) })
})

export const deleteBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.body.id)
  if (blog?.image) deleteImageFile(blog.image)
  await Blog.findByIdAndDelete(req.body.id)
  await Comment.deleteMany({ blog: req.body.id })
  res.json({ success: true })
})

export const publishBlog = asyncHandler(async (req, res) => {
  await Blog.findByIdAndUpdate(req.body.id, { isPublished: true })
  res.json({ success: true })
})

export const unpublishBlog = asyncHandler(async (req, res) => {
  await Blog.findByIdAndUpdate(req.body.id, { isPublished: false })
  res.json({ success: true })
})

export const addComment = asyncHandler(async (req, res) => {
  await Comment.create(req.body)
  res.status(201).json({ success: true })
})

export const getBlogComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blog: req.body.blogId, isApproved: true }).sort({ createdAt: -1 })
  res.json({ success: true, comments })
})

// ГЕНЕРАЦИЯ С ОФОРМЛЕНИЕМ И ЧИСТКОЙ ЛИШНИХ ПРОБЕЛОВ
export const generateContent = asyncHandler(async (req, res) => {
  const { prompt } = req.body
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, message: 'Введите тему для генерации' })
  }

  const systemInstruction = `
Generate a structured, professional blog article body in valid HTML for the topic: "${prompt.trim()}".
Rules:
- Use <h2> for main sections.
- Use <p> for paragraphs.
- Use <ul> and <li> for lists.
- Use <strong> for emphasis.
- Return ONLY HTML. No markdown, no backticks, no introduction phrases.
- Start directly with the first tag (e.g., <h2> or <p>).
`.trim()

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: systemInstruction }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
    })

    let rawContent = chatCompletion.choices[0]?.message?.content || ""

    // Очистка: убираем markdown-обертки и лишние переносы строк в начале
    const content = rawContent
      .replace(/```html|```/g, '') // Убираем ```html
      .replace(/^\s+/, '')         // Убираем энтеры/пробелы в начале
      .trim();                     // Полировка по краям

    res.json({ success: true, content })
  } catch (error) {
    console.error('Groq Error:', error.message)
    res.status(502).json({ success: false, message: 'Ошибка AI: ' + error.message })
  }
})