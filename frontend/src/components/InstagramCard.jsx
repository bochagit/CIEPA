import * as React from 'react'
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Avatar,
    Chip
} from '@mui/material'
import {
    Instagram as InstagramIcon,
    OpenInNew as OpenIcon,
    Favorite as FavoriteIcon,
    Camera as CameraIcon
} from '@mui/icons-material'

const InstagramCard = ({
    handle = "ciepa.centro",
    displayName = "CIEPA",
    description = "Centro Interdisciplinario de Estudios en Políticas Ambientales. Política ambiental para transformar la realidad.",
}) => {
    const instagramUrl = `https://instagram.com/${handle}`

    return (
        <Card
            elevation={3}
            sx={{
                height: '100%',
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    background: 'rgba(255, 255, 255, .1)',
                    borderRadius: '50%',
                    zIndex: 0
                }}
            />
            <Box 
                sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 100,
                    height: 100,
                    background: 'rgba(255, 255, 255, .05)',
                    borderRadius: '50%',
                    zIndex: 0
                }}
            />

            <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', p: 1, top: '50%', transform: 'translateY(-50%)' }}>
                <Box sx={{ mb: 2 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: 'rgba(255, 255, 255, .2)',
                            border: '3px solid rgba(255, 255, 255, .3)'
                        }}
                    >
                        <InstagramIcon sx={{ fontSize: 40, color: '#fff' }} />
                    </Avatar>

                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                        @{handle}
                    </Typography>

                    <Typography variant="h6" sx={{ opacity: .9, mb: 1 }}>
                        {displayName}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: .8, mb: 2 }}>
                        {description}
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ opacity: .9 }}>
                    Seguinos para ver nuestras últimas actividades y novedades.
                </Typography>

                <CardActions sx={{ position: 'relative', zIndex: 1, justifyContent: 'center', pt: 0 }}>
                    <Button
                        fullWidth
                        endIcon={<OpenIcon />}
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            mx: 2,
                            mb: 2,
                            mt: 4,
                            backgroundColor: 'rgba(255, 255, 255, .2)',
                            color: '#fff',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, .3)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, .3)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, .3)'
                            },
                            transition: 'all .3s ease'
                        }}
                    >
                        Seguir en Instagram
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    )
}

export default InstagramCard