import * as React from 'react'
import {
    Box,
    Typography,
    Container,
    Grid,
    Divider,
    styled,
    IconButton
} from '@mui/material'
import YouTubeVideos from './YouTubeVideos'
import InstagramCard from './InstagramCard';
import { brand } from '../../shared-theme/themePrimitives';
import { secondary } from '../../shared-theme/themePrimitives';
import { Email as EmailIcon } from '@mui/icons-material';

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(10),
  fontWeight: 600,
  color: brand.main,
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 60,
    height: 3,
    backgroundColor: brand.main,
    borderRadius: 2,
  }
}));

const Audiovisual = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <IconButton
                color="inherit"
                size="large"
                href="mailto:ciepa@agro.uba.ar"
                target='_blank'
                rel='noopener noreferrer'
                aria-label="Email"
                sx={{
                    position: 'fixed',
                    bottom: 40,
                    right: 50,
                    alignSelf: 'center', 
                    borderRadius: '50%', 
                    borderColor: secondary.variant,
                    transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out, border-radius .2s ease-in-out', 
                    backgroundColor: secondary.main,
                    zIndex: 1000,
                    '&:hover': 
                        { 
                            transform: 'translateY(-4px)', 
                            boxShadow: 3,
                            backgroundColor: secondary.variant,
                            borderColor: secondary.main
                        }, 
                    '&::before':
                        {
                            content: { xs: '""', lg: '"Contactate"' }, 
                            position: 'absolute', 
                            fontSize: '.8rem',
                            color: 'text.primary', 
                            top: -22,
                            fontWeight: 500
                        },
                    '&::after': 
                        { 
                            content: { xs: '""', lg: '"ciepa@agro.uba.ar"' }, 
                            position: 'absolute', 
                            fontSize: '.8rem', 
                            color: 'text.primary', 
                            top: 50, 
                            fontWeight: 500 
                        }
                }}
            >
                <EmailIcon sx={{ color: '#fff' }} />
            </IconButton>
            <SectionTitle variant="h3" component="h2">
                Audiovisual
            </SectionTitle>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <YouTubeVideos maxVideos={6} />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                    <InstagramCard />
                </Grid>
            </Grid>

            <Divider sx={{ my: 6 }} />

            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h5" gutterBottom>
                    Conectá con nosotros
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Seguinos en nuestras redes sociales para mantenerte informada/o sobre todas nuestras actividades, investigaciones y eventos.
                </Typography>
            </Box>
        </Container>
    )
}

export default Audiovisual