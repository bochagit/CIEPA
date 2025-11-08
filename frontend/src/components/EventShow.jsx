import * as React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    Chip,
    ImageList,
    ImageListItem,
    Dialog,
    IconButton,
    Alert,
    Skeleton,
    Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as BackIcon,
    Close as CloseIcon,
    ZoomIn as ZoomIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';

export default function EventShow() {
    const [event, setEvent] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [selectedImage, setSelectedImage] = React.useState(null)
    const [imageDialog, setImageDialog] = React.useState(false)

    const navigate = useNavigate()
    const { eventId } = useParams()

    const typeLabels = {
        conversatorio: 'Conversatorios',
        formacion: 'Ciclo de formaciones',
        jornada: 'Jornadas'
    }

    const typeColors = {
        conversatorio: 'primary',
        formacion: 'secondary',
        jornada: 'success'
    }

    React.useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true)
                const eventData = await eventService.getEventById(eventId)
                setEvent(eventData)
                setError('')
            } catch(err) {
                setError('Error al cargar el evento: ' + err.message)
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (eventId) {
            fetchEvent()
        }
    }, [eventId])

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

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl)
        setImageDialog(true)
    }

    const handleCloseImageDialog = () => {
        setImageDialog(false)
        setSelectedImage(null)
    }

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                            <Skeleton variant="rectangular" height={400} />
                            <CardContent>
                                <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
                                <Skeleton variant="text" height={20} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
                                <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                                <Skeleton variant="text" height={20} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/dashboard/events')}
                >
                    Volver a Eventos
                </Button>
            </Box>
        )
    }

    if (!event) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Evento no encontrado
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/dashboard/eventos')}
                >
                    Volver a Eventos
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/dashboard/eventos')}
                >
                    Volver a Eventos
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/dashboard/eventos/${eventId}/edit`)}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                            // TODO: Implementar confirmación de eliminación
                            console.log('Eliminar evento')
                        }}
                    >
                        Eliminar
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={event.coverImage}
                            alt={event.title}
                            sx={{ 
                                objectFit: 'cover',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleImageClick(event.coverImage)}
                        />
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Chip 
                                    label={typeLabels[event.type]} 
                                    color={typeColors[event.type]}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {formatDateForDisplay(event.date)}
                                </Typography>
                            </Box>
                            
                            <Typography variant="h4" component="h1" gutterBottom>
                                {event.title}
                            </Typography>
                            
                            <Typography variant="body1" color="text.secondary">
                                Evento creado el {new Date(event.createdAt).toLocaleDateString('es-AR')}
                                {event.updatedAt && event.updatedAt !== event.createdAt && (
                                    <span> • Última actualización: {new Date(event.updatedAt).toLocaleDateString('es-AR')}</span>
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Información del Evento
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Tipo
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {typeLabels[event.type]}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Fecha
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formatDateForDisplay(event.date)}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Imágenes en galería
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {event.gallery?.length || 0} imagen{event.gallery?.length !== 1 ? 'es' : ''}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    ID del evento
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {event._id}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {event.gallery && event.gallery.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Galería ({event.gallery.length} imagen{event.gallery.length !== 1 ? 'es' : ''})
                                </Typography>
                                
                                <ImageList cols={4} gap={8}>
                                    {event.gallery.map((image, index) => (
                                        <ImageListItem 
                                            key={index} 
                                            sx={{ 
                                                position: 'relative',
                                                cursor: 'pointer',
                                                '&:hover .zoom-icon': {
                                                    opacity: 1
                                                }
                                            }}
                                            onClick={() => handleImageClick(image.url)}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`Galería ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: 200,
                                                    objectFit: 'cover',
                                                    borderRadius: 4
                                                }}
                                            />
                                            <IconButton
                                                className="zoom-icon"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                    color: 'white',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)'
                                                    }
                                                }}
                                                size="large"
                                            >
                                                <ZoomIcon />
                                            </IconButton>
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            <Dialog
                open={imageDialog}
                onClose={handleCloseImageDialog}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        boxShadow: 'none'
                    }
                }}
            >
                <Box sx={{ position: 'relative', p: 2 }}>
                    <IconButton
                        onClick={handleCloseImageDialog}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)'
                            },
                            zIndex: 1
                        }}
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
                                maxHeight: '80vh',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </Box>
            </Dialog>
        </Box>
    )
}