import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated()
    const currentUser = authService.getCurrentUser()

    console.log('ProtectedRoute - Autenticado: ', isAuthenticated)
    console.log('Usuario actual: ', currentUser)

    if (!isAuthenticated) {
        console.log('Redirigiendo a inicio de sesión...')
        return <Navigate to="/signin" replace />
    }
    
    return children
}

export default ProtectedRoute