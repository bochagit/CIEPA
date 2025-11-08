import * as React from 'react'
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Skeleton
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';

export default function EventsList(){
    const [events, setEvents] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [searchTerm, setSearchTerm] = React.useState('')
    const [typeFilter, setTypeFilter] = React.useState('')
    const [deleteDialog, setDeleteDialog] = React.useState({ open: false, event: null })

    const navigate = useNavigate()

    const typeLabels = {
        conversatorio: 'Conversatorios',
        formacion: 'Ciclo de formaciones',
        jornada: 'Jornadas'
    }

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const response = await eventService.getAllEvents({
                search: searchTerm,
                type: typeFilter,
                limit: 50
            })
            setEvents(response.events || [])
            setError('')
        } catch(err) {
            setError('Error al cargar eventos')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchEvents()
    }, [searchTerm, typeFilter])

    const handleDelete = async () => {
        try {
            await eventService.deleteEvent(deleteDialog.event._id)
            setDeleteDialog({ open: false, event: null })
            fetchEvents()
        } catch(err) {
            setError('Error al eliminar evento')
            console.error(err)
        }
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
    <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de eventos
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/eventos/new')}
            >
                Nuevo evento
            </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
                label="Buscar eventos"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 250 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Tipo de evento</InputLabel>
                <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Tipo de evento"
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="conversatorio">Conversatorios</MenuItem>
                    <MenuItem value="formacion">Ciclos de formacion</MenuItem>
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
                                <Skeleton variant="text" height={20} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        ) : (
            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={event.coverImage}
                                alt={event.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Chip
                                        label={typeLabels[event.type]}
                                        size="small"
                                        color={typeColors[event.type]}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDateForDisplay(event.date)}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {event.gallery?.length || 0} imágenes en galería
                                </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                <IconButton
                                    size="small"
                                    onClick={() => navigate(`/dashboard/eventos/${event._id}`)}
                                    title="Ver"
                                >
                                    <ViewIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => navigate(`/dashboard/eventos/${event._id}/edit`)}
                                    title="Editar"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setDeleteDialog({ open: true, event })}
                                    title="Eliminar"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )}
                
        {events.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay eventos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {typeFilter ? `No hay eventos de tipo "${typeLabels[typeFilter]}"` : 'No se encontraron eventos'}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/dashboard/eventos/new')}
                >
                    Crear primer evento
                </Button>
            </Box>
        )}

        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, event: null })}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
                <Typography>
                    ¿Estás seguro de que queres eliminar el evento "{deleteDialog.event?.title}"?
                    Esta acción eliminará tambien todas las imagenes asociadas y no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteDialog({ open: false, event: null })}>
                    Cancelar
                </Button>
                <Button onClick={(handleDelete)} color="error" variant="contained">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  )
}