import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User'

export const login = async (req, res) => {
    try {
        const { name, password } = req.body

        const user = await User.findOne({ name })
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!user || !passwordMatch) return res.status(401).json({ message: "Usuario o contraseña incorrectos" })

        const token = jwt.sign(
            { id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: { id: user._id, name: user.name }
        })
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}