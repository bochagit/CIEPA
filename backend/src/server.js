import dotenv from 'dotenv'

dotenv.config()

import connectDB from './config/db.js'
import app from './app.js'

console.log('🔍 Variables cargadas:')
console.log('PORT:', process.env.PORT)
console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'SET' : 'NOT SET')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')

const PORT = process.env.PORT || 4000

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
})