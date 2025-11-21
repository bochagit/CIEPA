import api from './api'

const extractPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null

    try {
        const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\?|$)/
        const match = url.match(regex)

        if (match && match[1]){
            let publicId = match[1]
            publicId = publicId.replace(/\.[a-zA-Z0-9]+$/, '')
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

    uploadReportImage: async (file) => {
        try {
            const formData = new FormData()
            formData.append('image', file)

            console.log('Subiendo imagen de informe...')

            const response = await api.post('/upload/informe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('Imagen de informe subida: ', response.data.url)
            return response.data
        } catch(error) {
            console.error('Error subiendo imagen de informe: ', error)
            throw new Error(error.response?.data?.message || 'Error al subir la imagen')
        }
    },

    uploadPDF: async (file, onProgress = null) => {
        try {
            console.log('Subiendo PDF')
            console.log('Archivo: ', file.name, 'Tamaño: ', (file.size / 1024 / 1024).toFixed(2), 'MB')

            if (file.type !== 'application/pdf'){
                throw new Error('Solo se permiten archivos PDF')
            }

            const maxSize = 50 * 1024 * 1024
            if (file.size > maxSize){
                throw new Error('El archivo no puede pesar mas de 50MB')
            }

            const formData = new FormData()
            formData.append('pdf', file)

            const response = await api.post('/upload/pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress){
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        onProgress(percentCompleted)
                    }
                }
            })

            console.log('PDF subido exitosamente')
            console.log('URL: ', response.data.url)

            return {
                url: response.data.url,
                publicId: response.data.publicId,
                originalName: file.name,
                size: file.size
            }
        } catch(error) {
            console.error('Error subiendo PDF: ', error)
            throw new Error(error.response?.data?.message || error.message || 'Error al subir PDF')
        }
    },

    deleteFileByUrl: async (fileUrl) => {
        try {
            console.log('Eliminando archivo: ', fileUrl)

            const publicId = extractPublicIdFromUrl(fileUrl)
            if (!publicId) {
                throw new Error('No se puede extraer el publicId de la URL')
            }

            console.log('Public ID extraído: ', publicId)

            const encodedPublicId = encodeURIComponent(publicId)
            const response = await api.delete(`/upload/file/${encodedPublicId}`)

            console.log('Archivo eliminado del servidor')
            return response.data
        } catch(error) {
            console.error('Error eliminando archivo: ', error)
            throw error
        }
    },

    deleteImage: async (publicId) => {
        try {
            console.log('Eliminando imagen: ', publicId)

            const encodedPublicId = encodeURIComponent(publicId)
            const response = await api.delete(`/upload/image/${encodedPublicId}`)

            console.log('Imagen eliminada')
            return response.data
        } catch(error) {
            console.error('Error eliminando imagen: ', error)
            throw new Error(error.response?.data?.message || 'Error al eliminar la imagen')
        }
    },

    deleteImageByUrl: async (imageUrl) => {
        try {
            console.log('Eliminando por URL')
            console.log('URL recibida: ', imageUrl)

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