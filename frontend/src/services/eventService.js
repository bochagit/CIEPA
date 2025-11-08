import api from './api'

export const eventService = {
    getAllEvents: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams()

            if (params.page) queryParams.append('page', params.page)
            if (params.limit) queryParams.append('limit', params.limit)
            if (params.search) queryParams.append('search', params.search)
            if (params.type) queryParams.append('type', params.type)

            const response = await api.get(`/eventos?${queryParams.toString()}`)
            return response.data
        } catch(error) {
            console.error('Error fetching events: ', error)
            throw new Error(error.response?.data?.message || 'Error al obtener eventos')
        }
    },

    getEventById: async (id) => {
        try {
            const response = await api.get(`/eventos/${id}`)
            return response.data
        } catch(error) {
            console.error('Error fetching event: ', error)
            throw new Error(error.response?.data?.message || 'Error al obtener el evento')
        }
    },

    createEvent: async (eventData) => {
        try {
            const response = await api.post('/eventos', eventData)
            return response.data
        } catch(error) {
            console.error('Error creating event: ', error)
            throw new Error(error.response?.data?.message || 'Error al crear el evento')
        }
    },

    updateEvent: async (id, eventData) => {
        try {
            const response = await api.put(`/eventos/${id}`, eventData)
            return response.data
        } catch(error) {
            console.error('Error updating event: ', error)
            throw new Error(error.response?.data?.message || 'Error al actualizar el evento')
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await api.delete(`/eventos/${id}`)
            return response.data
        } catch(error) {
            console.error('Error deleting event: ', error)
            throw new Error(error.response?.data?.message || 'Error al eliminar el evento')
        }
    },

    getEventsByType: async (type, limit = 12) => {
        try {
            const response = await api.get(`/eventos/tipo/${type}?limit=${limit}`)
            return response.data
        } catch(error) {
            console.error('Error fetching events by type: ', error)
            throw new Error(error.response?.data?.message || 'Error al obtener eventos por tipo')
        }
    }
}