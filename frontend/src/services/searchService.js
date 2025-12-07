import api from './api'

export const searchService = {
    search: async (query) => {
        try {
            const response = await api.get('/search', {
                params: { q: query }
            })
            return response.data
        } catch (error) {
            console.error('Error en búsqueda:', error)
            throw error
        }
    }
}