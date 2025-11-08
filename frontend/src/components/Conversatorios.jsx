import * as React from 'react'
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Dialog,
    DialogContent,
    IconButton,
    ImageList,
    ImageListItem,
    Skeleton,
    Alert
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { eventService } from '../services/eventService'

export default function Conversatorios() {
    const [events, setEvents] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [selectedEvent, setSelectedEvent] = React.useState(null)
    const [galleryDialog, setGalleryDialog] = React.useState(false)

    React.useEffect(() => {
        const fetchConversatorios = async () => {
            try {
                setLoading(true)
                const response = await eventService.getEventsByType('conversatorio', 20)
                setEvents(response.events || [])
                setError('')
            } catch(err) {
                setError('Error al cargar conversatorios')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchConversatorios()
    }, [])

    const handleEventClick = (event) => {
        setSelectedEvent(event)
        setGalleryDialog(true)
    }

    const handleCloseGallery = () => {
        setGalleryDialog(false)
        setSelectedEvent(null)
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
            Conversatorios
        </Typography>
        
        {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        )}

        {loading ? (
            <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Card>
                            <Skeleton variant="rectangular" height={200} />
                            <CardContent>
                                <Skeleton variant="text" height={32} />
                                <Skeleton variant="text" height={20} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        ) : events.length > 0 ? (
            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event._id}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform .2s, box-shadow .2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => handleEventClick(event)}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={event.coverImage}
                                alt={event.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(event.date)}
                                </Typography>
                                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                                    {event.gallery?.length || 0} imágenes • Click para ver galería
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay conversatorios disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Pronto compartiremos nuevos espacios de diálogo
                </Typography>
            </Box>
        )}

        <Dialog
            open={galleryDialog}
            onClose={handleCloseGallery}
            maxWidth="lg"
            fullWidth
        >
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleCloseGallery}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, .9)',
                            zIndex: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {selectedEvent && (
                        <Box>
                            <Box sx={{ p: 3, backgroundColor: 'primary.main', color: '#fff' }}>
                                <Typography variant="h5" gutterBottom>
                                    {selectedEvent.title}
                                </Typography>
                                <Typography variant="body1">
                                    {formatDateForDisplay(selectedEvent.date)}
                                </Typography>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                {selectedEvent.gallery && selectedEvent.gallery.length > 0 ? (
                                    <ImageList cols={3} gap={8}>
                                        {selectedEvent.gallery.map((image, index) => (
                                            <ImageListItem key={index}>
                                                <img
                                                    src={image.url}
                                                    alt={`${selectedEvent.title} - Imagen ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: 200,
                                                        objectFit: 'cover',
                                                        borderRadius: 4
                                                    }}
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                ) : (
                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No hay imágenes disponibles para este evento.
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    </Container>
  )
}