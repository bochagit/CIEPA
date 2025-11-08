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

export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.params

        const result = await cloudinary.uploader.destroy(publicId)

        if (result.result === 'ok'){
            res.json({ message: 'Imagen eliminada exitosamente' })
        } else {
            res.status(404).json({ message: 'Imagen no encontrada' })
        }
    } catch(error) {
        console.error('Error eliminando imagen: ', error)
        res.status(500).json({ message: 'Error al eliminar la imagen' })
    }
}