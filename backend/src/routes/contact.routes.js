import express from 'express'
import { createContact, getAllContacts, getContactById, updateContact, deleteContact, getUnreadCount } from '../controllers/contact.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Ruta pública para enviar mensaje
router.post('/', createContact)

// Rutas protegidas para admin
router.get('/', authenticateToken, getAllContacts)
router.get('/unread-count', authenticateToken, getUnreadCount)
router.get('/:id', authenticateToken, getContactById)
router.patch('/:id', authenticateToken, updateContact)
router.delete('/:id', authenticateToken, deleteContact)

export default router
