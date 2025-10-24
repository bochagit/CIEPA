import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { connectDB } from '../config/db'

dotenv.config()
await connectDB()

const createAdmin = async () => {
    const hashedPassword = await bcrypt.hash("<your_password>", 10)
    const user = await User.create({
        name: "<your_name>",
        password: hashedPassword,
        role: "admin"
    })
    console.log("Usuario creado: ", user.name)
    process.exit()
}

createAdmin()