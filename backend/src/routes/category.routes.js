import { Router } from 'express'
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getAllCategories)
router.get('/:id', getCategoryById)

router.post('/', verifyToken, createCategory)
router.put('/:id', verifyToken, updateCategory)
router.delete('/:id', verifyToken, deleteCategory)

export default router