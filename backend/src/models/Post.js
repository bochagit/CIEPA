import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: false },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    status: { type: String, default: 'draft' },
    coverImage: { type: String },
    images: [{ type: String }],
    featured: { type: Boolean, default: false }
})

export default mongoose.model("Post", postSchema)