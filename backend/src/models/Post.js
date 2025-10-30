import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
    coverImage: { type: String },
    featured: { type: Boolean, default: false }
})

export default mongoose.model("Post", postSchema)