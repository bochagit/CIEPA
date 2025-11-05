import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context){
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const isTokenExpired = (token) => {
        if (!token) return true
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const currentTime = Date.now() / 1000

            console.log('Token expira en: ', new Date(payload.exp * 1000))
            console.log('Tiempo actual: ', new Date())

            return payload.exp < currentTime
        } catch(error) {
            console.error('Error decodificando token: ', error)
            return true
        }
    }

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token')
            const userData = localStorage.getItem('user')

            console.log('Verificando autenticación...')

            if (token && userData){
                if (isTokenExpired(token)){
                    console.log('Token expirado, cerrando sesión')
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    setUser(null)
                } else {
                    console.log('Token válido, restaurando sesión')
                    setUser(JSON.parse(userData))
                }
            } else {
                console.log('No hay sesión guardada')
                setUser(null)
            }

            setLoading(false)
        }

        initializeAuth()
    }, [])

    useEffect(() => {
        if (!user) return

        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token')
            if (token && isTokenExpired(token)){
                console.log('Token expiró durante la sesión')
                logout()
            }
        }

        const interval = setInterval(checkTokenExpiration, 10 * 60 * 1000)

        return () => clearInterval(interval)
    }, [user])

    const login = async (name, password) => {
        try {
            console.log('Intentando login...')
            const response = await authService.login(name, password)

            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))

            setUser(response.user)

            console.log('Login exitoso: ', response.user.name)
            return { success: true }
        } catch(error) {
            console.error('Error en login: ', error)
            throw error
        }
    }

    const logout = () => {
        console.log('Cerrando sesión...')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}