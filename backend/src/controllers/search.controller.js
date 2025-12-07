import Post from '../models/Post.js'
import Report from '../models/Report.js'
import Event from '../models/Event.js'

export const search = async (req, res) => {
    try {
        const { q } = req.query

        if (!q || q.trim().length < 2) {
            return res.json({ results: [] })
        }

        const searchRegex = new RegExp(q, 'i')

        const posts = await Post.find({
            $or: [
                { title: searchRegex },
                { content: searchRegex },
                { summary: searchRegex },
                { 'authors.name': searchRegex }
            ],
            status: 'published'
        })
        .select('title summary authors date category')
        .limit(5)
        .lean()

        const reports = await Report.find({
            $or: [
                { title: searchRegex },
                { introduction: searchRegex },
                { 'authors.name': searchRegex }
            ]
        })
        .select('title introduction authors date category')
        .limit(5)
        .lean()

        const events = await Event.find({
            $or: [
                { title: searchRegex },
                { introduction: searchRegex }
            ]
        })
        .select('title type date introduction')
        .limit(5)
        .lean()

        const results = [
            ...posts.map(post => ({
                type: 'nota',
                id: post._id,
                title: post.title,
                subtitle: post.summary || post.content?.substring(0, 100) + '...',
                authors: post.authors?.map(a => a.name).join(', '),
                date: post.date,
                url: `/notas/${post._id}`
            })),
            ...reports.map(report => ({
                type: 'informe',
                id: report._id,
                title: report.title,
                subtitle: report.introduction?.substring(0, 100) + '...',
                authors: report.authors?.map(a => a.name).join(', '),
                date: report.date,
                url: `/informes/${report._id}`
            })),
            ...events.map(event => ({
                type: 'actividad',
                id: event._id,
                title: event.title,
                subtitle: event.introduction?.substring(0, 100) + '...',
                eventType: event.type,
                date: event.date,
                url: `/actividades/${event._id}`
            }))
        ]

        results.sort((a, b) => new Date(b.date) - new Date(a.date))

        res.json({ results: results.slice(0, 10) })
    } catch (error) {
        console.error('Error en búsqueda:', error)
        res.status(500).json({ message: 'Error en búsqueda', error: error.message })
    }
}