import * as React from 'react'
import { Box, Button, Typography, Container, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown'
import InstagramIcon from '@mui/icons-material/Instagram'
import YoutubeIcon from '@mui/icons-material/YouTube'

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
                display: { xs: 'none', md: 'block' },
                bgcolor: 'transparent',
                py: 1,
                zIndex: 1100,
                width: '100%',
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                        color="inherit"
                        size="small"
                        href="https://www.instagram.com/ciepa.centro/"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="Instagram"
                        sx={{ alignSelf: 'center' }}
                        >
                        <InstagramIcon />
                        </IconButton>
                        <IconButton
                        color="inherit"
                        size="small"
                        href="https://www.youtube.com/"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="Instagram"
                        sx={{ alignSelf: 'center' }}
                        >
                        <YoutubeIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                </Box>
            </Container>
        </Box>
    );
}