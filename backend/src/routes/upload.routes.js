import { Router } from "express";
import { uploadPost, uploadEditor, uploadEvent, uploadEventGallery } from "../config/cloudinary.js";
import { uploadPostImage, uploadEditorImage, uploadEventImage, uploadEventGallery as uploadEventGalleryController, deleteImage } from "../controllers/cloudinary.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/post', verifyToken, uploadPost, uploadPostImage)

router.post('/editor', verifyToken, uploadEditor, uploadEditorImage)

router.post('/evento', verifyToken, uploadEvent, uploadEventImage)
router.post('/evento-galeria', verifyToken, uploadEventGallery, uploadEventGalleryController)

router.delete('/:publicId', verifyToken, deleteImage)

export default router