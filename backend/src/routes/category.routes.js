import { Router } from 'express'
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getInactiveCategories,
    reactivateCategory
} from '../controllers/category.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getAllCategories)
router.get('/inactive', verifyToken, getInactiveCategories)
router.get('/:id', getCategoryById)

router.post('/', verifyToken, createCategory)
router.put('/:id', verifyToken, updateCategory)
router.put('/:id/reactivate', verifyToken, reactivateCategory)
router.delete('/:id', verifyToken, deleteCategory)

export default router