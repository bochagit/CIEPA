import { Router } from "express";
import { 
    uploadPost, 
    uploadEditor,
    uploadEvent, 
    uploadEventGallery,
    uploadReport,
    uploadPDF
} from "../config/cloudinary.js";
import { 
    uploadPostImage, 
    uploadEditorImage, 
    uploadEventImage, 
    uploadEventGallery as uploadEventGalleryController, 
    uploadReportImage,
    uploadPDFFile,
    deleteFile,
    deleteImage 
} from "../controllers/cloudinary.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/post', verifyToken, uploadPost, uploadPostImage)

router.post('/editor', verifyToken, uploadEditor, uploadEditorImage)

router.post('/evento', verifyToken, uploadEvent, uploadEventImage)
router.post('/evento-galeria', verifyToken, uploadEventGallery, uploadEventGalleryController)

router.delete('/image/:publicId', verifyToken, deleteImage)
router.delete('/file/:publicId', verifyToken, deleteFile)

router.post('/informe', verifyToken, uploadReport, uploadReportImage)
router.post('/pdf', verifyToken, uploadPDF, uploadPDFFile)

export default router