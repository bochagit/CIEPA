import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export const login = async (req, res) => {
    try {
        const { name, password } = req.body

        const user = await User.findOne({ name })
        if (!user){
            console.log('Usuario no encontrado');
            return res.status(401).json({message: "Usuario o contraseña incorrectos"})
        }

        console.log('Usuario encontrado: ', user.name)

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) return res.status(401).json({ message: "Usuario o contraseña incorrectos" })

        console.log('Login exitoso')

        const tokenDuration = process.env.JWT_EXPIRE || '12h'

        const token = jwt.sign(
            { id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: tokenDuration }
        )

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: { id: user._id, name: user.name },
            expiresIn: tokenDuration
        })
    } catch(error) {
        console.error('Error en login: ', error)
        res.status(500).json({ message: error.message })
    }
}