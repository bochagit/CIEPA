import * as React from 'react'
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    IconButton,
    Skeleton,
    Alert,
    Dialog,
    Button,
    Chip,
    styled
} from '@mui/material'
import {
    ArrowBack as ArrowBackIcon,
    ZoomIn as ZoomIcon,
    Close as CloseIcon
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { eventService } from '../services/eventService'
import { brand } from '../../shared-theme/themePrimitives'
import InstagramIcon from '@mui/icons-material/Instagram'

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
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

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 400,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
  }
}));

export default function ActividadDetalle(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [event, setEvent] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [selectedImage, setSelectedImage] = React.useState(null)
    const [imageDialog, setImageDialog] = React.useState(false)

    const getEventTypeLabel = (type) => {
    const typeLabels = {
      'conversatorio': 'Conversatorio',
      'formacion': 'Ciclo de formaciones',
      'jornada': 'Jornadas'
    }
    return typeLabels[type] || type
  }

  const getEventTypeColor = (type) => {
    const typeColors = {
      'conversatorio': 'primary',
      'formacion': 'secondary',
      'jornada': 'success'
    }
    return typeColors[type] || 'default'
  }

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''

    console.log('Fecha original en lista: ', dateString)
    try {
      if (typeof dateString === 'string' && dateString.includes('T')){
        const dateOnly = dateString.split('T')[0]
        const [year, month, day] = dateOnly.split('-')
        const formatted = `${day}/${month}/${year}`
        console.log('Fecha formateada para mostrar: ', formatted)
        return formatted
      }

      if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)){
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
      }

      if (dateString instanceof Date){
        const day = String(dateString.getDate()).padStart(2, '0')
        const month = String(dateString.getMonth() + 1).padStart(2, '0')
        const year = dateString.getFullYear();
        return `${day}/${month}/${year}`
      }

      return dateString
    } catch(error) {
      console.warn('Error formateando fecha: ', error)
      return dateString
    }
  }

  React.useEffect(() => {
    const fetchEvent = async () => {
        try {
            setLoading(true)
            console.log('Cargando evento: ', id)

            const eventData = await eventService.getEventById(id)
            console.log('Evento cargado: ', eventData)

            setEvent(eventData)
            setError('')
        } catch(err) {
            console.error('Error cargando evento: ', err)
            setError('Error al cargar el evento')
        } finally {
            setLoading(false)
        }
    }

    if (id){
        fetchEvent()
    }
  }, [id])
  
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setImageDialog(true)
  }

  const handleCloseImageDialog = () => {
    setImageDialog(false)
    setSelectedImage(null)
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading){
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 4 }} />
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} sx={{ mb: 4 }} />
            <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
  }

  if (error || !event) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ mb: 4 }}>
                {error || 'Evento no encontrado'}
            </Alert>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                Volver
            </Button>
        </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
            Volver
        </Button>

        <HeroSection sx={{ backgroundImage: `url(${event.coverImage})` }}>
            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
                <Chip label={getEventTypeLabel(event.type)} color={getEventTypeColor(event.type)} sx={{ mb: 2, fontSize: '.9rem', fontWeight: 600 }} />
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}>
                    {event.title}
                </Typography>
                <Typography variant="h5" sx={{ opacity: .9 }}>
                    {formatDateForDisplay(event.date)}
                </Typography>
                {event.instagramLink && (
                    <Button
                        variant="contained"
                        startIcon={<InstagramIcon />}
                        href={event.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            bgcolor: '#e1306c',
                            '&:hover': {
                                bgcolor: '#c13584'
                            }
                        }}
                    >
                        Ver publicación en Instagram
                    </Button>
                )}
            </Box>
        </HeroSection>

        <SectionTitle variant="h3" component="h2">
            Galería de imágenes
        </SectionTitle>
        
        {event.gallery && event.gallery.length > 0 ? (
            <Grid container spacing={3}>
                {event.gallery.map((image, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Card
                            sx={{ 
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'transform .3s ease-in-out, box-shadow .3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6,
                                    '& .zoom-overlay': {
                                        opacity: 1
                                    }
                                }
                             }}
                             onClick={() => handleImageClick(image.url)}
                        >
                            <CardMedia
                                component="img"
                                height="250"
                                image={image.url}
                                alt={`${event.title} - Imagen ${index + 1}`}
                                sx={{ objectFit: 'cover' }}
                            />

                            <Box
                                className="zoom-overlay"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, .6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0,
                                    transition: 'opacity .3s ease-in-out'
                                }}
                            >
                                <IconButton
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, .9)',
                                        color: brand.main,
                                        transition: 'background-color .1s ease-in-out, transform .1s ease-in-out',
                                        margin: 'auto',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    size="large"
                                >
                                    <ZoomIcon fontSize="large" />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        ) : (
            <Box sx={{
                textAlign: 'center',
                py: 8,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                border: `1px solid ${brand.main}`
                }}
            >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay imágenes disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Este evento aún no tiene una galería de imágenes.
                </Typography>
            </Box>
        )}

        <Dialog
            open={imageDialog}
            onClose={handleCloseImageDialog}
            maxWidth="lg"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: 'rgba(0, 0, 0, .95)',
                    boxShadow: 'none',
                    margin: 1
                }
            }}
        >
            <Box sx={{ position: 'relative', p: 2 }}>
                <IconButton
                    onClick={handleCloseImageDialog}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: '#fff',
                        backgroundColor: 'rgba(0, 0, 0, .7)',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, .9)'
                        },
                        zIndex: 1
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>

                {selectedImage && (
                    <img
                        src={selectedImage}
                        alt="Vista ampliada"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            borderRadius: 8
                        }}
                    />
                )}
            </Box>
        </Dialog>
    </Container>
  )
}