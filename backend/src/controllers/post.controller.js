import Post from '../models/Post'
import sanitizeHtml from 'sanitize-html'

const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span", "u", "iframe"
    ]),
    allowedAttributes: {
        img: ["src", "alt", "width", "height", "style"],
        a: ["href", "name", "target"],
        iframe: ["src", "width", "height", "allow", "frameborder", "allowfullscreen"],
        "*": ["style"]
    },
    allowedSchemes: ["data", "http", "https"]
}

export const createPost = async (req, res) => {
    try {
        const { title, summary, content, author, date, category, status, coverImage, images, featured } = req.body

        if (!title || !content){
            return res.status(400).json({ message: "El titulo y el contenido son obligatorios" })
        }

        const cleanContent = sanitizeHtml(content, sanitizeOptions)

        const post = new Post({ title, summary, content: cleanContent, author, date, category, status, coverImage, images, featured })

        await post.save()
        res.status(201).json(post)
    } catch(error) {
        console.error("Error al crear el post: ", error)
        res.status(500).json({ message: "Error al crear el post" })
    }
}

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch(error) {
        res.status(500).json({ message: "Error al obtener los posts" })
    }
}

export const getPostsById = async (req, res) => {
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
        const { title, summary, content, author, date, category, status, coverImage, images, featured } = req.body
        const cleanContent = sanitizeHtml(content, sanitizeOptions)

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                summary,
                content: cleanContent,
                author,
                date,
                category,
                status,
                coverImage,
                images,
                featured
            },
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
        const post = await Post.findByIdAndDelete(req.params.id)
        if (!post) return res.status(400).json({ message: "Post no encontrado" })
        res.json({ message: "Nota eliminada correctamente" })
    } catch(error) {
        res.status(500).json({ message: "Error al intentar eliminar el post" })
    }
}