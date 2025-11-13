import api from './api'

const extractPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null

    try {
        const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\?|$)/
        const match = url.match(regex)

        if (match && match[1]){
            let publicId = match[1]
            publicId = publicId.replace(/\.[^.]+$/, '')
            return publicId
        }

        return null
    } catch(error) {
        console.error('Error extrayendo publicId: ', error)
        return null
    }
}

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

    uploadEventImage: async (file) => {
        try {
            const formData = new FormData()
            formData.append('image', file)

            console.log('Subiendo imagen de evento')

            const response = await api.post('/upload/evento', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('Imagen de evento subida: ', response.data.url)
            return response.data
        } catch(error) {
            console.error('Error subiendo imagen de evento: ', error)
            throw new Error(error.response?.data?.message || 'Error al subir la imagen')
        }
    },

    uploadEventGallery: async (files) => {
        try {
            const formData = new FormData()

            files.forEach(file => {
                formData.append('images', file)
            })

            console.log(`Subiendo ${files.length} imagenes de galería...`)
            
            const response = await api.post('/upload/evento-galeria', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('Galería subida: ', response.data.count, 'imagenes')
            return response.data
        } catch(error) {
            console.error('Error subiendo galería: ', error)
            throw new Error(error.response?.data?.message || 'Error al subir la galería')
        }
    },

    deleteImage: async (publicId) => {
        try {
            console.log('Eliminando imagen: ', publicId)

            const encodedPublicId = encodeURIComponent(publicId)
            const response = await api.delete(`/upload/${encodedPublicId}`)

            console.log('Imagen eliminada')
            return response.data
        } catch(error) {
            console.error('Error eliminando imagen: ', error)
            throw new Error(error.response?.data?.message || 'Error al eliminar la imagen')
        }
    },

    deleteImageByUrl: async (imageUrl) => {
        try {
            const publicId = extractPublicIdFromUrl(imageUrl)
            if (!publicId) {
                throw new Error('No se puede extraer el publicId de la URL')
            }

            console.log('Eliminando imagen por URL: ', imageUrl)
            console.log('PublicId extraído: ', publicId)

            return await uploadService.deleteImage(publicId)
        } catch(error) {
            console.error('Error eliminando imagen por URL: ', error)
            throw new Error(error.message || 'Error al eliminar la imagen')
        }
    }
}