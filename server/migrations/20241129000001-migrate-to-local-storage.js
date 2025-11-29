import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dbLogger from '../src/utils/dbLogger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Migration: Setup local file storage for blog images
 * Created: 2024-11-29
 * 
 * This migration:
 * 1. Ensures the uploads/blogs directory exists
 * 2. Copies seed images to uploads directory
 * 3. Updates existing blog image URLs from external sources to local paths
 */

const uploadsDir = path.join(__dirname, '../uploads/blogs')
const seedImagesDir = path.join(__dirname, '../seed-images')

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

// Copy seed image and return the new filename
const copySeedImage = (seedImageName) => {
  const sourcePath = path.join(seedImagesDir, seedImageName)
  
  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️  Seed image not found: ${seedImageName}`)
    return null
  }

  const ext = path.extname(seedImageName)
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
  const newFilename = `blog-${uniqueSuffix}${ext}`
  const destPath = path.join(uploadsDir, newFilename)

  fs.copyFileSync(sourcePath, destPath)
  return `/uploads/blogs/${newFilename}`
}

// Map of seed images for each blog (based on fixture order)
const seedImageMap = [
  'blog_pic_1.png',
  'blog_pic_2.png',
  'blog_pic_3.png',
  'blog_pic_4.png',
  'blog_pic_5.png',
  'blog_pic_6.png'
]

export async function up(db) {
  try {
    dbLogger.logMigration('20241129000001-migrate-to-local-storage', 'STARTING', 'Setting up local file storage')

    // Ensure uploads directory exists
    ensureUploadsDir()
    console.log('✅ Ensured uploads/blogs directory exists')

    // Get all blogs that have external image URLs
    const blogs = await db.collection('blogs').find({
      image: { $regex: /^https?:\/\// }
    }).toArray()

    console.log(`📷 Found ${blogs.length} blogs with external image URLs`)

    // Update each blog with a local image
    let updatedCount = 0
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i]
      const seedImageIndex = i % seedImageMap.length
      const seedImage = seedImageMap[seedImageIndex]
      
      const newImagePath = copySeedImage(seedImage)
      
      if (newImagePath) {
        await db.collection('blogs').updateOne(
          { _id: blog._id },
          { $set: { image: newImagePath } }
        )
        updatedCount++
        console.log(`   Updated: ${blog.title.substring(0, 40)}...`)
      }
    }

    dbLogger.logMigration('20241129000001-migrate-to-local-storage', 'SUCCESS', `Updated ${updatedCount} blogs to local storage`)
    console.log(`\n✅ Migration up: Migrated ${updatedCount} blogs to local file storage`)
  } catch (error) {
    dbLogger.logError('20241129000001-migrate-to-local-storage UP', error)
    throw error
  }
}

export async function down(db) {
  try {
    dbLogger.logMigration('20241129000001-migrate-to-local-storage', 'ROLLING_BACK', 'Note: Cannot restore original external URLs')

    // We can't restore the original external URLs, so just log a warning
    console.log('⚠️  Migration down: Cannot restore original external URLs')
    console.log('   Run the seed script to reset the database with fresh data')

    dbLogger.logMigration('20241129000001-migrate-to-local-storage', 'ROLLED_BACK', 'Rollback noted - manual intervention may be needed')
    console.log('✅ Migration down: Completed (no changes made)')
  } catch (error) {
    dbLogger.logError('20241129000001-migrate-to-local-storage DOWN', error)
    throw error
  }
}
