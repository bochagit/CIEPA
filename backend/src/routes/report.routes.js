import { Router } from 'express'
import {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
    incrementDownloads
} from '../controllers/report.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getAllReports)
router.get('/:id', getReportById)
router.patch('/:id/download', incrementDownloads)

router.post('/', verifyToken, createReport)
router.put('/:id', verifyToken, updateReport)
router.delete('/:id', verifyToken, deleteReport)

export default router