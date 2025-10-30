import api from './api'

export const uploadService = {
    uploadPostImage: async(file) => {
        try {
            const formData = new FormData()
            formData.append('image', file)

            console.log('Subiendo imagen de post...')

            const response = await api.post('/upload/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log('Imagen de post subida: ', response.data.url)
            return response.data
        } catch(error) {
            console.error('Error subiendo imagen de post: ', error)
            throw new Error(error.response?.data?.message || 'Error al subir la imagen')
        }
    },

    uploadEditorImage: async (file) => {
        try {
            const formData = new FormData()
            formData.append('image', file)

            console.log('Subiendo imagen del editor...')

            const response = await api.post('/upload/editor', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log('Imagen del editor subida: ', response.data.url)
            return response.data
        } catch(error) {
            console.error('Error subiendo imagen del editor', error)
            throw new Error(error.response?.data?.message || 'Error al subir la imagen')
        }
    },

    deleteImage: async (publicId) => {
        try {
            console.log('Eliminando imagen: ', publicId)

            const response = await api.delete(`/upload/${publicId}`)

            console.log('Imagen eliminada')
            return response.data
        } catch(error) {
            console.error('Error eliminando imagen: ', error)
            throw new Error(error.response?.data?.message || 'Error al eliminar la imagen')
        }
    }
}