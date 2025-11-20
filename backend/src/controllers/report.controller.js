import Report from "../models/Report"
import { cloudinary } from '../config/cloudinary.js'

export const createReport = async (req, res) => {
    try {
        console.log('Creando informe')
        console.log('Datos recibidos: ', req.body)

        const {
            title,
            introduction,
            authors,
            date,
            coverImage,
            pdfFile,
        } = req.body

        if (!Array.isArray(authors) || authors.length === 0){
            return res.status(400).json({
                success: false,
                message: 'Debe incluir al menos un autor'
            })
        }

        const reportData = {
            title: title.trim(),
            introduction: introduction.trim(),
            authors: authors.map(author => ({
                name: author.name.trim()
            })),
            date,
            coverImage,
            pdfFile
        }

        console.log('Datos a guardar: ', reportData)

        const report = new Report(reportData)
        const savedReport = await report.save()

        console.log('Informe creado: ', savedReport._id)
        console.log('Fin creación\n')

        res.status(201).json({
            succes: true,
            report: savedReport,
            message: 'Informe creado exitosamente'
        })
    } catch(error) {
        console.error('Error creando informe: ', error)

        if (error.name === 'ValidationError'){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({
                succes: false,
                message: 'Errores de validación',
                errors
            })
        }

        res.status(500).json({
            succes: false,
            message: 'Error interno del servidor'
        })
    }
}

export const getAllReports = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = '',
            status = 'published'
        } = req.query

        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        const skip = (pageNumber - 1) * limitNumber

        let filter = { status }

        if (search.trim()){
            filter.$text = { $search: search }
        }

        const reports = await Report.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNumber)
        
        const total = await Report.countDocuments(filter)

        res.json({
            success: true,
            reports,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                hasNext: pageNumber < Math.ceil(total / limitNumber),
                hasPrev: pageNumber > 1
            }
        })
    } catch(error) {
        console.error('Error obteniendo informes: ', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener informes'
        })
    }
}

export const getReportById = async (req, res) => {
    try {
        const { id } = req.params
        const report = await Report.findById(id)

        if (!report){
            return res.status(404).json({
                success: false,
                message: 'Informe no encontrado'
            })
        }

        res.json({
            success: true,
            report
        })
    } catch(error) {
        console.error('Error obteniendo informe: ', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener el informe'
        })
    }
}

export const incrementDownloads = async (req, res) => {
    try {
        const { id } = req.params

        const report = await Report.findByIdAndUpdate(
            id,
            { $inc: { downloads: 1 } },
            { new: true }
        )

        if (!report){
            return res.status(404).json({
                success: false,
                message: 'Informe no encontrado'
            })
        }

        res.json({
            success: true,
            downloads: report.downloads
        })
    } catch(error) {
        console.error('Error incrementando descargas: ', error)
        res.status(500).json({
            success: false,
            message: 'Error al incrementar descargas'
        })
    }
}

export const updateReport = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = { ...req.body }

        if (updateData.authors){
            updateData.authors = updateData.authors.map(author => ({
                name: author.name.trim()
            }))
        }

        const report = await Report.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!report){
            return res.status(404).json({
                success: false,
                message: 'Informe no encontrado'
            })
        }

        res.json({
            success: true,
            report,
            message: 'Informe actualizado exitosamente'
        })
    } catch(error) {
        console.error('Error actualizando informe: ', error)
        res.status(500).json({
            success: false,
            message: 'Error al actualizar informe'
        })
    }
}

export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params
        const report = await Report.findById(id)

        if (!report){
            return res.status(404).json({
                success: false,
                message: 'Informe no encontrado'
            })
        }

        if (report.coverImage){
            try {
                const publicId = report.coverImage.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(`ciepa/reports/covers/${publicId}`)
            } catch(cloudinaryError) {
                console.warn('Error eliminando imagen: ', cloudinaryError)
            }
        }

        if (report.pdfFile?.publicId){
            try {
                await cloudinary.uploader.destroy(report.pdfFile.publicId, { resource_type: 'raw' })
            } catch(cloudinaryError) {
                console.warn('Error eliminando PDF: ', cloudinaryError)
            }
        }

        await Report.findByIdAndDelete(id)

        res.json({
            success: true,
            message: 'Informe eliminado exitosamente'
        })
    } catch(error) {
        console.error('Error eliminando informe: ', error)
        res.status(500).json({
            success: false,
            message: 'Error al eliminar informe'
        })
    }
}