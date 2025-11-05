import api from './api'

export const youtubeService = {
    getVideos: async (limit = 8) => {
        try {
            const response = await api.get(`/youtube/videos?limit=${limit}`)
            return response.data
        } catch(error) {
            console.error('Error en getVideos: ', error)
            throw new Error(error.response?.data?.message || 'Error al obtener videos de YouTube')
        }
    },

    getChannelInfo: async () => {
        try {
            const response = await api.get('/youtube/channel')
            return response.data
        } catch(error) {
            throw new Error(error.response?.data?.message || 'Error al obtener información del canal')
        }
    }
}