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