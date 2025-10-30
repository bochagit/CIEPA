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

            if (error.response){
                const errorMessage = error.response.data?.message || 'Error del servidor'
                console.error('Error del servidor: ', errorMessage)
                throw new Error(errorMessage)
            } else if (error.request){
                console.error('Error de red: ', error.request)
                throw new Error('Error de conexión. Verifica tu conexión a internet.')
            } else {
                console.error('Error desconocido: ', error.message)
                throw new Error('Error inesperado. Intentelo nuevamente.')
            }
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