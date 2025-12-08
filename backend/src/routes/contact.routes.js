import express from 'express'
import { createContact, getAllContacts, getContactById, updateContact, deleteContact, getUnreadCount } from '../controllers/contact.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Ruta pública para enviar mensaje
router.post('/', createContact)

// Rutas protegidas para admin
router.get('/', verifyToken, getAllContacts)
router.get('/unread-count', verifyToken, getUnreadCount)
router.get('/:id', verifyToken, getContactById)
router.patch('/:id', verifyToken, updateContact)
router.delete('/:id', verifyToken, deleteContact)

export default router
