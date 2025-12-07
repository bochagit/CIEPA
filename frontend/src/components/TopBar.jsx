import * as React from 'react'
import { Box, Button, Typography, Container, IconButton, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import EmailIcon from '@mui/icons-material/EmailOutlined'
import { useAuth } from '../context/AuthContext'
import { brand } from '../../shared-theme/themePrimitives'

export default function TopBar(){
    const navigate = useNavigate()
    const { isAuthenticated, user, logout } = useAuth()

    const handleSignInClick = () => { navigate('/signin') }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleDashboardClick = () => {
        navigate('/dashboard')
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
                    <Stack
                        spacing={2}
                        useFlexGap
                        sx={{ justifyContent: 'left', color: 'text.secondary', flexDirection: 'row' }}
                    >
                        <IconButton
                        color="inherit"
                        size="large"
                        href="https://www.youtube.com/@ciepacentro"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="YouTube"
                        sx={{ alignSelf: 'center', borderRadius: '50%', color: brand.main, backgroundColor: '#fff !important' }}
                        >
                        <YouTubeIcon />
                        </IconButton>
                        <IconButton
                        color="inherit"
                        size="large"
                        href="https://www.instagram.com/ciepa.centro/"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="Instagram"
                        sx={{ alignSelf: 'center', borderRadius: '50%', color: brand.main, backgroundColor: '#fff !important' }}
                        >
                        <InstagramIcon />
                        </IconButton>
                        <IconButton
                        color="inherit"
                        size="large"
                        href="mailto:ciepa@agro.uba.ar"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="Email"
                        sx={{ alignSelf: 'center', borderRadius: '50%', color: brand.main, backgroundColor: '#fff !important' }}
                        >
                        <EmailIcon />
                        </IconButton>
                    </Stack>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {isAuthenticated ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Hola, {user?.name}
                                </Typography>
                                <Button color="primary" variant="outlined" size="small" onClick={handleDashboardClick}>
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