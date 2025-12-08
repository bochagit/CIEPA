import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    mensaje: {
        type: String,
        required: true
    },
    leido: {
        type: Boolean,
        default: false
    },
    respondido: {
        type: Boolean,
        default: false
    },
    notas: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

contactSchema.index({ createdAt: -1 })
contactSchema.index({ leido: 1 })
contactSchema.index({ respondido: 1 })

export default mongoose.model('Contact', contactSchema)
