import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    introduction: {
        type: String,
        required: true,
        trim: true
    },
    authors: [{
        name: {
            type: String,
            required: true,
            trim: true
        }
    }],
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    coverImage: {
        type: String,
        required: true
    },
    pdfFile: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    },
    downloads: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

reportSchema.index({ title: 'text', introduction: 'text', 'authors.name': 'text', category: 'text' })
reportSchema.index({ date: -1 })
reportSchema.index({ category: 1 })

export default mongoose.model('Report', reportSchema)