import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import connectDB from '../config/db'

dotenv.config()

const createAdmin = async () => {
    try {
        await connectDB()

        const existingUser = await User.findOne({ name: "<your_name>" })
        if (existingUser) {
            console.log('Usuario existente')
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash("<your_password>", 10)
        const user = await User.create({
        name: "<your_name>",
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