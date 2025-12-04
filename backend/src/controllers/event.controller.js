import Event from '../models/Event.js'
import { cloudinary } from '../config/cloudinary.js'

const extractPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null

    try {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?(?:\?|$)/)
        return match ? match[1] : null
    } catch(error) {
        console.error('Error extrayendo public Id: ', error)
        return null
    }
}

const extractAllEventImages = (coverImage, gallery) => {
    const publicIds = []

    if (coverImage){
        const coverPublicId = extractPublicIdFromUrl(coverImage)
        if (coverPublicId){
            publicIds.push(coverPublicId)
        }
    }

    if (gallery && Array.isArray(gallery)){
        gallery.forEach(img => {
            const publicId = extractPublicIdFromUrl(img.url)
            if (publicId && !publicIds.includes(publicId)){
                publicIds.push(publicId)
            }
        })
    }

    return publicIds
}

export const getAllEvents = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            type = ''
        } = req.query

        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        const skip = (pageNumber - 1) * limitNumber

        let filter = {}

        if (search.trim()){
            filter.title = { $regex: search, $options: 'i' }
        }

        if (type) filter.type = type

        console.log('Filtros de eventos aplicados: ', JSON.stringify(filter, null, 2))

        const events = await Event.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
        
        const total = await Event.countDocuments(filter)

        res.json({
            events,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            total,
            hasNext: pageNumber < Math.ceil(total / limitNumber),
            hasPrev: pageNumber > 1
        })
    } catch(error) {
        console.error('Error en getAllEvents: ', error)
        res.status(500).json({ message: "Error al obtener los eventos" })
    }
}

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event){
            return res.status(404).json({ message: "Evento no encontrado" })
        }
        res.json(event)
    } catch(error) {
        console.error('Error en getEventById: ', error)
        res.status(500).json({ message: "Error al obtener el evento" })
    }
}

export const createEvent = async (req, res) => {
    try {
        const {
            title,
            type,
            date,
            coverImage,
            gallery = [],
            instagramLink,
            introduction
        } = req.body

        const newEvent = new Event({
            title,
            type,
            date,
            coverImage,
            gallery: gallery.map((img, index) => ({
                url: img.url || img,
                order: img.order || index
            })),
            instagramLink,
            introduction
        })

        const savedEvent = await newEvent.save()
        console.log('Evento creado: ', savedEvent.title)

        res.status(201).json(savedEvent)
    } catch(error) {
        console.error('Error en createEvent: ', error)
        res.status(500).json({ message: "Error al crear el evento" })
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        if (updateData.gallery){
            updateData.gallery = updateData.gallery.map((img, index) => ({
                url: img.url || img,
                order: img.order !== undefined ? img.order : index
            }))
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!updatedEvent){
            return res.status(404).json({ message: "Evento no encontrado" })
        }

        console.log('Evento actualizado: ', updatedEvent.title)
        res.json(updatedEvent)
    } catch(error) {
        console.error('Error en updateEvent: ', error)
        res.status(500).json({ message: "Error al actualizar el evento" })
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params
        
        const event = await Event.findById(id)
        if (!event){
            return res.status(404).json({ message: "Evento no encontrado" })
        }

        const imagesToDelete = extractAllEventImages(event.coverImage, event.gallery)

        let imagesDeleted = 0
        if (imagesToDelete.length > 0) {
            console.log(`Eliminando ${imagesToDelete.length} imágenes de Cloudinary...`)

            for (const publicId of imagesToDelete){
                try {
                    const result = await cloudinary.uploader.destroy(publicId)
                    if (result.result === 'ok' || result.result === 'not found'){
                        imagesDeleted++
                        console.log(`Imagen eliminada: ${publicId}`)
                    }
                } catch(error) {
                    console.error(`Error eliminando imagen ${publicId}: `, error.message)
                }
            }
        }

        await Event.findByIdAndDelete(id)
        console.log('Evento eliminado: ', event.title)

        res.json({ message: "Evento eliminado correctamente", imagesDeleted })
    } catch(error) {
        console.error('Error en deleteEvent: ', error)
        res.status(500).json({ message: "Error al eliminar el evento" })
    }
}

export const getEventsByType = async (req, res) => {
    try {
        const { type } = req.params
        const { limit = 12 } = req.query

        if (!['conversatorio', 'formacion', 'jornada'].includes(type)){
            return res.status(400).json({ message: "Tipo de evento inválido" })
        }

        const events = await Event.find({ type })
            .sort({ date: -1, createdAt: -1 })
            .limit(parseInt(limit))
        
        res.json({
            events,
            total: events.length,
            type
        })
    } catch(error) {
        console.error('Error en getEventsByType: ', error)
        res.status(500).json({ message: "Error al obtener eventos por tipo" })
    }
}