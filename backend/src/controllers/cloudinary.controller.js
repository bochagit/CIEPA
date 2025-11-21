import { cloudinary } from "../config/cloudinary.js";

export const uploadPostImage = async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).json({ message: 'No se subió ningún archivo' })
        }

        console.log('Imagen de post subida: ', req.file.path)

        res.json({
            message: 'Imagen subida exitosamente',
            url: req.file.path,
            publicId: req.file.filename
        })
    } catch(error) {
        console.error('Error subiendo imagen de post: ', error)
        res.status(500).json({ message: 'Error al subir la imagen' })
    }
}

export const uploadEditorImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningun archivo' })
        }

        console.log('Imagen del editor subida: ', req.file.path)

        res.json({
            message: 'Imagen subida exitosamente',
            url: req.file.path,
            publicId: req.file.filename
        })
    } catch(error) {
        console.error('Error subiendo imagen del editor: ', error)
        res.status(500).json({ message: 'Error al subir la imagen' })
    }
}

export const uploadEventImage = async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).json({ message: 'No se subió ningún archivo' })
        }

        console.log('Imagen de evento subida: ', req.file.path)

        res.json({
            message: 'Imagen subida exitosamente',
            url: req.file.path,
            publicId: req.file.filename
        })
    } catch(error) {
        console.error('Error subiendo imagen de evento: ', error)
        res.status(500).json({ message: 'Error al subir la imagen' })
    }
}

export const uploadEventGallery = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0){
            return res.status(400).json({ message: 'No se subieron archivos' })
        }

        console.log(`${req.files.length} imágenes de galería subidas`)

        const uploadedImages = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }))

        res.json({
            message: 'Imágenes subidas exitosamente',
            images: uploadedImages,
            count: uploadedImages.length
        })
    } catch(error) {
        console.error('Error subiendo galería: ', error)
        res.status(500).json({ message: 'Error al subir las imágenes' })
    }
}

export const uploadReportImage = async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).json({ message: 'No se subió ningún archivo' })
        }

        console.log('Imagen de informe subida: ', req.file.path)

        res.json({
            message: 'Imagen subida exitosamente',
            url: req.file.path,
            publicId: req.file.filename
        })
    } catch(error) {
        console.error('Error subiendo imagen de informe: ', error)
        res.status(500).json({ message: 'Error al subir la imagen' })
    }
}

export const uploadPDFFile = async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).json({ message: 'No se subió ningún archivo PDF' })
        }

        console.log('PDF subido: ', req.file.path)

        res.json({
            message: 'PDF subido exitosamente',
            url: req.file.path,
            publicId: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        })
    } catch(error) {
        console.error('Error subiendo PDF: ', error)
        res.status(500).json({ message: 'Error al subir el PDF' })
    }
}

export const deleteFile = async (req, res) => {
    try {
        const { publicId } = req.params
        const { resourceType = 'image' } = req.body || req.query

        let detectedResourceType = resourceType
        if (!resourceType){
            detectedResourceType = publicId.includes('pdf') ? 'raw' : 'image'
        }

        if (!publicId){
            return res.status(400).json({
                message: 'Public ID es requerido'
            })
        }

        console.log('Eliminando archivo: ', publicId, 'Tipo: ', detectedResourceType)
        
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: detectedResourceType
        })

        if (result.result === 'ok'){
            console.log('Archivo eliminado exitosamente')
            res.json({
                message: 'Archivo eliminado exitosamente'
            })
        } else {
            console.warn('Archivo no encontrado o ya eliminado')
            res.json({
                message: 'Archivo no encontrado o ya eliminado'
            })
        }
    } catch(error) {
        console.error('Error eliminando archivo', error)
        res.status(500).json({
            message: 'Error eliminando archivo'
        })
    }
}

export const deleteImage = async (req, res) => {
    try {

        console.log('Inicio Delete Image')
        console.log('Params recibidos: ', req.params)
        console.log('URL completa', req.originalUrl)
        console.log('Método', req.method)
        console.log('Headers', req.headers)

        let { publicId } = req.params

        console.log('PublicId inicial: ', publicId)
        console.log('Tipo: ', typeof publicId)
        console.log('Longitud: ', publicId?.length)

        if (!publicId) {
            console.log('PublicId vacío')
            return res.status(400).json({ message: 'PublicId es requerido', received: publicId })
        }

        const originalPublicId = publicId
        publicId = decodeURIComponent(publicId)

        console.log('PublicId originial: ', originalPublicId)
        console.log('PublicId decodificado: ', publicId)

        const result = await cloudinary.uploader.destroy(publicId)

        if (result.result === 'ok'){
            res.json({ message: 'Imagen eliminada exitosamente' })
        } else if (result.result === 'not found'){
            res.status(404).json({ message: 'Imagen no encontrada' })
        } else {
            console.log('Resultado desconocido: ', result.result)
            res.status(500).json({ message: 'Respuesta inesperada de Cloudinary' })
        }
    } catch(error) {
        console.log('Error en delete image')
        console.error('Error name: ', error.name)
        console.error('Error message: ', error.message)
        console.error('Error stack: ', error.stack)
        console.error('PublicId que causí error: ', req.params.publicId)
        console.error('Error eliminando imagen: ', error)
        res.status(500).json({ message: 'Error al eliminar la imagen' })
    }
}