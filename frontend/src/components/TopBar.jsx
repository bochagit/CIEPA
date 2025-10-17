import * as React from 'react'
import { Box, Button, Typography, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown'

export default function TopBar(){
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = React.useState(null)

    const checkUser = React.useCallback(() => {
        // Revisar localStorage
        let user = localStorage.getItem('currentUser')
    
        //si no hay en localStorage, revisar sessionStorage
        if (!user) {
          user = sessionStorage.getItem('currentUser')
        }
    
        if (user) {
          setCurrentUser(JSON.parse(user))
        } else {
          setCurrentUser(null)
        }
    }, [])
    
    React.useEffect(() => {
        checkUser()
    
        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
          checkUser()
        }
    
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('userChanged', handleStorageChange)
    
        return () => {
          window.removeEventListener('storage', handleStorageChange)
          window.removeEventListener('userChanged', handleStorageChange)
        }
      }, [checkUser])

    const handleSignInClick = () => { navigate('/signin') }

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        sessionStorage.removeItem('currentUser')
        setCurrentUser(null)
        window.dispatchEvent(new CustomEvent('userChanged'))
    }

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'block' }, // ← Solo en desktop
                bgcolor: 'transparent',
                py: 1,
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: 1100, // ← Por encima de la AppBar
            }}
        >
        <Container maxWidth="lg">
            <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
            }}
            >
                {currentUser ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Hola, {currentUser.name}
                        </Typography>
                        <Button color="primary" variant="outlined" size="small" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                        <Button color="primary" variant="outlined" size="small" onClick={handleLogout}>
                            Cerrar sesión
                        </Button>
                        </Box>
                ) : (
                    <Button color="primary" variant="contained" size="small" onClick={handleSignInClick}>
                        Log in
                    </Button>
                    )}
                <ColorModeIconDropdown />
            </Box>
        </Container>
        </Box>
    );
}