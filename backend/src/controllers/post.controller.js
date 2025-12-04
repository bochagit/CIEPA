import Post from '../models/Post.js'
import sanitizeHtml from 'sanitize-html'
import { cloudinary } from '../config/cloudinary.js'

const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "video", "source", "iframe", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span", "u", "s", "b", "i", "strong", "em", "p", "br", "ul", "ol", "li", "iframe", "pre", "code", "hr", "a", "div"
    ]),
    allowedAttributes: {
        img: ["src", "alt", "width", "height", "style"],
        a: ["href", "name", "target", "rel"],
        iframe: ["src", "width", "height", "allow", "frameborder", "allowfullscreen", "title", "style"],
        video: ["src", "controls", "width", "height", "poster", "style"],
        source: ["src", "type"],
        "*": ["style", "class", "align", "dir", "lang"]
    },
    allowedSchemes: ["data", "http", "https"],
    allowedSchemesByTag: {
        img: ["data", "http", "https"],
        video: ["http", "https"],
        iframe: ["http", "https"]
    },
    allowedIframeHostnames: [
        "www.youtube.com",
        "www.google.com"
    ],
    transformTags: {
        "a": sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" })
    },
    parser: {
        lowerCaseAttributeNames: true
    },
}

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

const extractAllImages = (content, coverImage) => {
    const publicIds = []

    if (coverImage){
        const coverPublicId = extractPublicIdFromUrl(coverImage)
        if (coverPublicId){
            publicIds.push(coverPublicId)
        }
    }

    if (content) {
        const cloudinaryUrls = content.match(/https?:\/\/res\.cloudinary\.com\/[^"\s<>]+/g) || []

        cloudinaryUrls.forEach(url => {
            const publicId = extractPublicIdFromUrl(url)
            if (publicId && !publicIds.includes(publicId)){
                publicIds.push(publicId)
            }
        })
    }

    return publicIds
}

export const createPost = async (req, res) => {
    try {
        const { title, summary, content, authors, date, category, status, coverImage, featured } = req.body

        if (!title || !content){
            return res.status(400).json({ message: "El titulo y el contenido son obligatorios" })
        }

        if (!Array.isArray(authors) || authors.length === 0){
            return res.status(400).json({
                message: 'Debe incluir al menos un autor'
            })
        }

        const cleanContent = sanitizeHtml(content, sanitizeOptions)

        const post = new Post({ title, summary, content: cleanContent, authors: authors.map(author => ({ name: author.name.trim() })), date, category, status, coverImage, featured })

        await post.save()
        res.status(201).json(post)
    } catch(error) {
        console.error("Error al crear el post: ", error)
        res.status(500).json({ message: "Error al crear el post" })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            category = '',
            featured
        } = req.query

        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        const skip = (pageNumber - 1) * limitNumber

        let filter = {}

        if (search.trim()){
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { 'authors.name': { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        }

        if (status) {
            filter.status = status
        }

        if (category) {
            filter.category = category
        }

        if (featured !== undefined) {
            filter.featured = featured === 'true'
        }

        console.log('Filtros aplicados: ', filter)

        const posts = await Post.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)

        const total = await Post.countDocuments(filter)

        console.log(`Posts encontrados: ${posts.length} de ${total} total`)

        res.json({
            posts,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            total,
            hasNext: pageNumber < Math.ceil(total / limitNumber),
            hasPrev: pageNumber > 1
        })
    } catch(error) {
        res.status(500).json({ message: "Error al obtener los posts" })
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(400).json({ message: "Post no encontrado" })
        res.json(post)
    } catch(error) {
        res.status(500).json({ message: "Error al obtener el post" })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { title, summary, content, authors, date, category, status, coverImage, featured } = req.body
        const cleanContent = sanitizeHtml(content, sanitizeOptions)

        const updateData = {
            title,
            summary,
            content: cleanContent,
            date,
            category,
            status,
            coverImage,
            featured
        }

        if (authors && Array.isArray(authors)){
            updateData.authors = authors.map(author => ({ name: author.name.trim() }))
        }

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )

        if (!post) return res.status(404).json({ message: "Post no encontrado" })
        res.json(post)
    } catch(error) {
        console.error("Error al actualizar el post: ", error)
        res.status(500).json({ message: "Error al actualizar el post" })
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(400).json({ message: "Post no encontrado" })
        }

        const imagesToDelete = extractAllImages(post.content, post.coverImage)

        let imagesDeleted = 0
        if (imagesToDelete.length > 0){
            console.log(`Eliminando ${imagesToDelete.length} imágenes de Cloudinary...`)

            for (const publicId of imagesToDelete){
                try {
                    const result = await cloudinary.uploader.destroy(publicId)
                    if (result.result === 'ok' || result.result === 'not found'){
                        imagesDeleted++
                        console.log(`Imagen eliminada: ${publicId}`)
                    }
                } catch(error) {
                    console.error(`Error eliminando imagen ${publicId}:`, error.message)
                }
            }
        }

        await Post.findByIdAndDelete(req.params.id)
        console.log('Post eliminado.')

        res.json({
            message: "Nota eliminada correctamente",
            imagesDeleted
        })

    } catch(error) {
        res.status(500).json({ message: "Error al intentar eliminar el post" })
    }
}