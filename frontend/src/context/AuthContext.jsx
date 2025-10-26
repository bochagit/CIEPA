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
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = () => {
        const authenticated = authService.isAuthenticated()
        const currentUser = authService.getCurrentUser()

        console.log('Verificando autenticación: ', { authenticated, currentUser })

        setIsAuthenticated(authenticated)
        setUser(currentUser)
        setLoading(false)
    }

    useEffect(() => {
        checkAuth()

        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                console.log('Cambio detectado en localStorage: ', e.key)
                checkAuth()
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    const login = async (name, password) => {
        try {
            const result = await authService.login(name, password)
            setIsAuthenticated(true)
            setUser(result.user)
            return result
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        authService.logout()
        setIsAuthenticated(false)
        setUser(null)
    }

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}