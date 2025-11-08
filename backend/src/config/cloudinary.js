import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

if (process.env.CLOUDINARY_URL){
    try {
        const url = new URL(process.env.CLOUDINARY_URL)

        const cloudName = url.hostname
        const apiKey = url.username
        const apiSecret = url.password

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        })
    } catch(error) {
        console.error('Error parsing CLOUDINARY_URL:', error.message)
    }
} else {
    console.error('CLOUDINARY_URL no está definida')
}

console.log('Cloudinary configurado:')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ciepa/posts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    }
})

const editorStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ciepa/editor',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    }
})

const eventStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ciepa/events',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    }
})

export const uploadPost = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single('image')

export const uploadEditor = multer({
    storage: editorStorage,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
}).single('image')

export const uploadEvent = multer({
    storage: eventStorage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single('image')

export const uploadEventGallery = multer({
    storage: eventStorage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).array('images', 10)

export { cloudinary }