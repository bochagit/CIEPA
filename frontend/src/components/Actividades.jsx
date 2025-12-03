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
    styled,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    alpha
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

const NextEventBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 400,
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[3],
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const BannerContent = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '24px',
  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
  color: 'white',
  zIndex: 1,
});

const getEventTypeLabel = (type) => {
  const labels = {
    conversatorio: 'Conversatorio',
    formacion: 'Ciclo de Formaciones',
    jornada: 'Jornada'
  }
  return labels[type] || type
}

const getEventTypeColor = (type) => {
  const colors = {
    conversatorio: 'primary',
    formacion: 'secondary',
    jornada: 'success'
  }
  return colors[type] || 'default'
}

export default function Actividades() {
    const [events, setEvents] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [typeFilter, setTypeFilter] = React.useState('')
    const [nextEvent, setNextEvent] = React.useState(null)
    const [selectOpen, setSelectOpen] = React.useState(false)

    const navigate = useNavigate()

    React.useEffect(() => {
        const fetchActividades = async () => {
            try {
                setLoading(true)
                const params = {
                    limit: 50,
                    ...(typeFilter && { type: typeFilter })
                }
                const response = await eventService.getAllEvents(params)
                const allEvents = response.events || []
                
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const futureEvents = []
                const pastEvents = []
                
                allEvents.forEach(event => {
                    const eventDate = new Date(event.date)
                    eventDate.setHours(0, 0, 0, 0)
                    if (eventDate >= today) {
                        futureEvents.push(event)
                    } else {
                        pastEvents.push(event)
                    }
                })
                
                futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
                
                pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
                
                if (futureEvents.length > 0) {
                    setNextEvent(futureEvents[0])
                }
                
                setEvents(pastEvents)
                setError('')
            } catch(err) {
                setError('Error al cargar actividades')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        const delayDebounceFn = setTimeout(() => {
            fetchActividades()
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [typeFilter])

    const handleEventClick = (event) => {
        navigate(`/actividades/${event._id}`)
    }

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return ''

        try {
            if (typeof dateString === 'string' && dateString.includes('T')){
                const dateOnly = dateString.split('T')[0]
                const [year, month, day] = dateOnly.split('-')
                return `${day}/${month}/${year}`
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
            {nextEvent && (
                <>
                    <SectionTitle variant="h3" component="h2">
                        Próxima Actividad
                    </SectionTitle>
                    
                    <NextEventBanner onClick={() => handleEventClick(nextEvent)}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${nextEvent.coverImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            }}
                        />
                        <BannerContent>
                            <Typography 
                                variant="h4" 
                                component="h3"
                                gutterBottom
                                sx={{ 
                                    fontWeight: 700,
                                    mb: 2
                                }}
                            >
                                {nextEvent.title}
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Chip 
                                    label={getEventTypeLabel(nextEvent.type)}
                                    size="small"
                                    sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.9)', 
                                        color: brand.main,
                                        fontWeight: 600
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {formatDateForDisplay(nextEvent.date)}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'inline-block',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    mt: 1
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#fff',
                                        fontWeight: 500
                                    }}
                                >
                                    Ver actividad
                                </Typography>
                            </Box>
                        </BannerContent>
                    </NextEventBanner>
                </>
            )}

            <SectionTitle variant="h3" component="h2" sx={{ mt: 6 }}>
                Actividades
            </SectionTitle>

            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel 
                        id="tipo-actividad-label"
                        sx={{
                            '&.MuiInputLabel-shrink': {
                                transform: 'translate(14px, -15px) scale(0.75)',
                            }
                        }}
                    >
                        Tipo de actividad
                    </InputLabel>
                    <Select
                        labelId="tipo-actividad-label"
                        id="tipo-actividad-select"
                        value={typeFilter}
                        label="Tipo de actividad"
                        onChange={(e) => setTypeFilter(e.target.value)}
                        onOpen={() => setSelectOpen(true)}
                        onClose={() => setSelectOpen(false)}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        <MenuItem value="conversatorio">Conversatorios</MenuItem>
                        <MenuItem value="formacion">Ciclo de Formaciones</MenuItem>
                        <MenuItem value="jornada">Jornadas</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
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
                                    <Box sx={{ my: 1 }}>
                                        <Chip 
                                            label={getEventTypeLabel(event.type)}
                                            color={getEventTypeColor(event.type)}
                                            size="small"
                                        />
                                    </Box>
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
                        No hay actividades disponibles
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {typeFilter ? 'Intenta con otros filtros de búsqueda.' : 'Pronto compartiremos nuevas actividades.'}
                    </Typography>
                </Box>
            )}
        </Container>
    )
}