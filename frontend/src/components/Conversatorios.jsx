import * as React from 'react'
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Skeleton,
    Alert,
    styled
} from '@mui/material'
import { eventService } from '../services/eventService'
import { brand } from '../../shared-theme/themePrimitives'
import { useNavigate } from 'react-router-dom'

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

export default function Conversatorios() {
    const [events, setEvents] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    const navigate = useNavigate()

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
        navigate(`/actividades/${event._id}`)
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
        <SectionTitle variant="h3" component="h2">
            Conversatorios
        </SectionTitle>
        
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
                                    {formatDateForDisplay(event.date)}
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
                    Pronto compartiremos nuevas actividades.
                </Typography>
            </Box>
        )}
    </Container>
  )
}