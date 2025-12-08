import Contact from '../models/Contact.js'

export const createContact = async (req, res) => {
    try {
        console.log('Creando nuevo contacto')
        const { nombre, correo, mensaje } = req.body

        if (!nombre || !correo || !mensaje) {
            return res.status(400).json({ 
                success: false,
                message: 'Todos los campos son requeridos' 
            })
        }

        const newContact = new Contact({
            nombre,
            correo,
            mensaje
        })

        await newContact.save()

        console.log('Contacto creado exitosamente:', newContact._id)

        res.status(201).json({ 
            success: true,
            message: 'Mensaje enviado correctamente',
            contact: newContact 
        })
    } catch (error) {
        console.error('Error al crear contacto:', error)
        res.status(500).json({ 
            success: false,
            message: 'Error al enviar mensaje', 
            error: error.message 
        })
    }
}

export const getAllContacts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            leido, 
            respondido 
        } = req.query

        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        const skip = (pageNumber - 1) * limitNumber

        const filter = {}
        if (leido !== undefined) filter.leido = leido === 'true'
        if (respondido !== undefined) filter.respondido = respondido === 'true'

        const contacts = await Contact.find(filter)
            .sort({ createdAt: -1 })
            .limit(limitNumber)
            .skip(skip)
            .lean()

        const total = await Contact.countDocuments(filter)

        res.json({
            success: true,
            contacts,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                total,
                hasNext: pageNumber < Math.ceil(total / limitNumber),
                hasPrev: pageNumber > 1
            }
        })
    } catch (error) {
        console.error('Error al obtener contactos:', error)
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener contactos', 
            error: error.message 
        })
    }
}

export const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)

        if (!contact) {
            return res.status(404).json({ 
                success: false,
                message: 'Contacto no encontrado' 
            })
        }

        res.json({
            success: true,
            contact
        })
    } catch (error) {
        console.error('Error al obtener contacto:', error)
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener contacto', 
            error: error.message 
        })
    }
}

export const updateContact = async (req, res) => {
    try {
        const { leido, respondido, notas } = req.body

        const updateData = {}
        if (leido !== undefined) updateData.leido = leido
        if (respondido !== undefined) updateData.respondido = respondido
        if (notas !== undefined) updateData.notas = notas

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!contact) {
            return res.status(404).json({ 
                success: false,
                message: 'Contacto no encontrado' 
            })
        }

        res.json({ 
            success: true,
            message: 'Contacto actualizado', 
            contact 
        })
    } catch (error) {
        console.error('Error al actualizar contacto:', error)
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar contacto', 
            error: error.message 
        })
    }
}

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id)

        if (!contact) {
            return res.status(404).json({ 
                success: false,
                message: 'Contacto no encontrado' 
            })
        }

        res.json({ 
            success: true,
            message: 'Contacto eliminado' 
        })
    } catch (error) {
        console.error('Error al eliminar contacto:', error)
        res.status(500).json({ 
            success: false,
            message: 'Error al eliminar contacto', 
            error: error.message 
        })
    }
}

export const getUnreadCount = async (req, res) => {
    try {
        const count = await Contact.countDocuments({ leido: false })
        res.json({ 
            success: true,
            count 
        })
    } catch (error) {
        console.error('Error al contar contactos no leídos:', error)
        res.status(500).json({ 
            success: false,
            message: 'Error al contar contactos', 
            error: error.message 
        })
    }
}
