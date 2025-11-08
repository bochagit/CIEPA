import { Router } from 'express'
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByType
} from '../controllers/event.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getAllEvents)
router.get('/tipo/:type', getEventsByType)
router.get('/:id', getEventById)

router.post('/', verifyToken, createEvent)
router.put('/:id', verifyToken, updateEvent)
router.delete('/:id', verifyToken, deleteEvent)

export default router