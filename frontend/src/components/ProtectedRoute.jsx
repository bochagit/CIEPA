import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkUser = () => {
            let user = localStorage.getItem('currentUser');
            if (!user) {
                user = sessionStorage.getItem('currentUser');
            }

            if (user) {
                setCurrentUser(JSON.parse(user));
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        }

        checkUser();

        const handleUserChange = () => {
            checkUser();
        }

        window.addEventListener('userChanged', handleUserChange)

        return () => {
            window.removeEventListener('userChanged', handleUserChange)
        }
    }, [])

    if (loading) {
        return <div>Cargando...</div>
    }

    if (!currentUser) {
        return <Navigate to="/signin" replace />
    }

    return children
}

export default ProtectedRoute