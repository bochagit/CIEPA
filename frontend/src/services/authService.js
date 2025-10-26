import api from "./api"

export const authService = {
    login: async (name, password) => {
        try {
            console.log('Llamando API login: ', { name })

            const response = await api.post('/auth/login', { name, password })

            console.log('Respuesta del servidor: ', response.data)

            const { token, user, expiresIn } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            console.log('Token guardado en LocalStorage')

            return { token, user, expiresIn }
        } catch(error) {
            console.error('Error en authService: ', error)
            throw error.response?.data || error.message
        }
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token')
        console.log('Verificando token: ', !!token)
        return !!token
    }
}