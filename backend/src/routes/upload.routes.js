import { Router } from "express";
import { uploadPost, uploadEditor } from "../config/cloudinary.js";
import { uploadPostImage, uploadEditorImage, deleteImage } from "../controllers/cloudinary.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/post', verifyToken, uploadPost, uploadPostImage)

router.post('/editor', verifyToken, uploadEditor, uploadEditorImage)

router.delete('/:publicId', verifyToken, deleteImage)

export default router