import api from './api'

export const contactService = {
    sendMessage: async (contactData) => {
        try {
            const response = await api.post('/contacts', contactData)
            return response.data
        } catch (error) {
            console.error('Error al enviar mensaje:', error)
            throw error
        }
    },

    getAllContacts: async (params = {}) => {
        try {
            const response = await api.get('/contacts', { params })
            return response.data
        } catch (error) {
            console.error('Error al obtener contactos:', error)
            throw error
        }
    },

    getContactById: async (id) => {
        try {
            const response = await api.get(`/contacts/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener contacto:', error)
            throw error
        }
    },

    updateContact: async (id, data) => {
        try {
            const response = await api.patch(`/contacts/${id}`, data)
            return response.data
        } catch (error) {
            console.error('Error al actualizar contacto:', error)
            throw error
        }
    },

    deleteContact: async (id) => {
        try {
            const response = await api.delete(`/contacts/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al eliminar contacto:', error)
            throw error
        }
    },

    getUnreadCount: async () => {
        try {
            const response = await api.get('/contacts/unread-count')
            return response.data
        } catch (error) {
            console.error('Error al obtener cantidad de no leídos:', error)
            throw error
        }
    }
}
