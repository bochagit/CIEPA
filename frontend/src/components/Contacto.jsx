import * as React from 'react'
import { styled, Typography, Box, alpha, TextField, Button, Paper, Stack, IconButton } from '@mui/material';
import { brand } from '../../shared-theme/themePrimitives';
import Mapa from './Mapa';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4, 0),
}));

export default function Contacto(){
    const [formData, setFormData] = React.useState({
        nombre: '',
        correo: '',
        mensaje: ''
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!formData.nombre || !formData.correo || !formData.mensaje){
            alert('Por favor completá todos los campos')
            return
        }

        console.log('Datos del formulario: ', formData)

        setFormData({
            nombre: '',
            correo: '',
            mensaje: ''
        })

        alert('¡Mensaje enviado correctamente!')
    }

    return (
        <SectionContainer>
            <SectionTitle variant="h3" component="h2">Suscribite para recibir novedades</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
                <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                    Desde el CIEPA elaboramos notas e informes y desarrollamos actividades de formación y debate sobre los principales temas de la agenda ambiental, articulando el rigor académico con una mirada crítica y un lenguaje accesible.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                    ¿Querés recibir información?
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 5 }}>¡Escribinos y dejanos tu mensaje!</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 0 }, justifyContent: 'center', alignItems: 'center', mt: 5 }}>
                <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: { xs: '100%', sm: '60%' },
                    height: 300,
                    backgroundColor: alpha(brand.main, 0.1),
                    borderRadius: 2,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    <TextField
                      id="nombre"
                      name="nombre"
                      label="Nombre completo"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      variant="standard"
                      fullWidth
                      required
                    />
                    <TextField
                      id="correo"
                      name="correo"
                      label="Correo electrónico"
                      type="email"
                      value={formData.correo}
                      onChange={handleInputChange}
                      variant="standard"
                      fullWidth
                      required
                    />
                    <TextField
                      id="mensaje"
                      name="mensaje"
                      label="Tu mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      variant="standard"
                      fullWidth
                      required
                      multiline
                      rows={4}
                      placeholder="Escribí acá tu consulta o mensaje..."
                      />
                    <Button
                      type="submit"
                      variant="text"
                      size="large"
                      sx={{
                        fontSize: '1rem',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            boxShadow: 4
                        },
                        '&:active': {
                            boxShadow: 0
                        }
                      }}
                    >
                        Enviar mensaje
                    </Button>
                </Box>
                <Mapa />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, mt: 8 }}>
                <Box sx={{ height: 150, width: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Typography variant="h5" color="textPrimary" sx={{ textDecoration: "underline" }}>Seguinos en las redes</Typography>
                    <Stack
                    spacing={2}
                    direction="row"
                    >
                        <IconButton
                        color="inherit"
                        size="medium"
                        href="https://www.instagram.com/ciepa.centro/"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="Instagram"
                        sx={{ alignSelf: 'center', borderRadius: '50%', transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out, border-radius .2s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, borderRadius: 2 } }}
                        >
                            <InstagramIcon />
                        </IconButton>
                        <IconButton
                        color="inherit"
                        size="medium"
                        href="https://youtube.com/"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="YouTube"
                        sx={{ alignSelf: 'center', borderRadius: '50%', transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out, border-radius .2s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, borderRadius: 2 } }}
                        >
                            <YouTubeIcon />
                        </IconButton>
                    </Stack>
                </Box>
                <Box sx={{ height: 150, width: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Typography variant="h5" color="textPrimary" sx={{ textDecoration: "underline" }}>Contacto vía mail</Typography>
                    <IconButton
                        color="inherit"
                        size="medium"
                        href="mailto:ciepa@agro.uba.ar"
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label="Email"
                        sx={{ alignSelf: 'center', borderRadius: '50%', transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out, border-radius .2s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, borderRadius: 2 }, '&::before': { content: '"ciepa@agro.uba.ar"', position: 'absolute', fontSize: '.8rem', color: 'text.secondary', top: 40, fontWeight: 200 } }}
                    >
                        <EmailIcon />
                    </IconButton>
                </Box>
            </Box>
        </SectionContainer>
    )
}