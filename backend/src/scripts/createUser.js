import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import connectDB from '../config/db.js'

dotenv.config()

const createAdmin = async () => {
    try {
        await connectDB()

        const existingUser = await User.findOne({ name: "CIEPA" })
        if (existingUser) {
            console.log('Usuario existente')
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash("admin123", 10)
        const user = await User.create({
        name: "CIEPA",
        password: hashedPassword,
        role: "admin"
    })

    console.log("Usuario creado: ", user.name)
    } catch(error) {
        console.error("Error creando usuario: ", error)
    } finally {
        mongoose.disconnect()
        process.exit(0)
    }
}

createAdmin()