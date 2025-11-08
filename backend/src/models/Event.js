import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['conversatorio', 'formacion', 'jornada']
    },
    date: {
        type: Date,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    gallery: [{
        url: String,
        order: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
})

eventSchema.index({ type: 1, date: -1 })

export default mongoose.model('Event', eventSchema)