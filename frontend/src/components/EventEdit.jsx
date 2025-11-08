import * as React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Grid,
    ImageList,
    ImageListItem,
    IconButton,
    CircularProgress,
    Backdrop,
    Skeleton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    PhotoLibrary as GalleryIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { uploadService } from '../services/uploadCloudinary';

export default function EventEdit() {
    const [formData, setFormData] = React.useState({
        title: '',
        type: 'conversatorio',
        date: new Date(),
        coverImage: '',
        gallery: []
    })
    const [originalData, setOriginalData] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [loadingEvent, setLoadingEvent] = React.useState(true)
    const [error, setError] = React.useState('')
    const [uploadingCover, setUploadingCover] = React.useState(false)
    const [uploadingGallery, setUploadingGallery] = React.useState(false)

    const navigate = useNavigate()
    const { eventId } = useParams()

    const typeLabels = {
        conversatorio: 'Conversatorios',
        formacion: 'Ciclo de formaciones',
        jornada: 'Jornadas'
    }

    React.useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoadingEvent(true)
                const event = await eventService.getEventById(eventId)
                
                const eventData = {
                    title: event.title,
                    type: event.type,
                    date: new Date(event.date),
                    coverImage: event.coverImage,
                    gallery: event.gallery || []
                }
                
                setFormData(eventData)
                setOriginalData(eventData)
                setError('')
            } catch(err) {
                setError('Error al cargar el evento: ' + err.message)
                console.error(err)
            } finally {
                setLoadingEvent(false)
            }
        }

        if (eventId) {
            fetchEvent()
        }
    }, [eventId])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        if (error) setError('')
    }

    const handleCoverImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        try {
            setUploadingCover(true)
            setError('')
            const uploadedImage = await uploadService.uploadEventImage(file)
            handleInputChange('coverImage', uploadedImage.url)
        } catch(err) {
            setError('Error al subir imagen de portada: ' + err.message)
            console.error(err)
        } finally {
            setUploadingCover(false)
        }
    }

    const handleGalleryUpload = async (event) => {
        const files = Array.from(event.target.files)
        if (files.length === 0) return

        try {
            setUploadingGallery(true)
            setError('')
            const uploadedGallery = await uploadService.uploadEventGallery(files)
            
            const newGalleryImages = uploadedGallery.images.map((img, index) => ({
                url: img.url,
                order: formData.gallery.length + index
            }))

            handleInputChange('gallery', [...formData.gallery, ...newGalleryImages])
        } catch(err) {
            setError('Error al subir imágenes de galería: ' + err.message)
            console.error(err)
        } finally {
            setUploadingGallery(false)
        }
    }

    const removeGalleryImage = (index) => {
        const newGallery = formData.gallery.filter((_, i) => i !== index)
        const reorderedGallery = newGallery.map((img, i) => ({ ...img, order: i }))
        handleInputChange('gallery', reorderedGallery)
    }

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('El título es requerido')
            return false
        }

        if (!formData.coverImage) {
            setError('La imagen de portada es requerida')
            return false
        }

        if (!formData.date) {
            setError('La fecha es requerida')
            return false
        }

        return true
    }

    const hasChanges = () => {
        if (!originalData) return false
        
        return (
            formData.title !== originalData.title ||
            formData.type !== originalData.type ||
            formData.date.getTime() !== originalData.date.getTime() ||
            formData.coverImage !== originalData.coverImage ||
            JSON.stringify(formData.gallery) !== JSON.stringify(originalData.gallery)
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setLoading(true)
            setError('')

            const eventData = {
                ...formData,
                title: formData.title.trim(),
                date: formData.date.toISOString()
            }

            await eventService.updateEvent(eventId, eventData)
            
            navigate('/dashboard/eventos', { 
                state: { 
                    message: `Evento "${formData.title}" actualizado exitosamente` 
                }
            })
        } catch(err) {
            setError('Error al actualizar evento: ' + err.message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loadingEvent) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={500} height={20} sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
                                <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Skeleton variant="rectangular" height={56} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Skeleton variant="rectangular" height={56} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
                                <Skeleton variant="rectangular" width={400} height={250} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Editar Evento
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Modifique la información del evento y las imágenes según sea necesario.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Información Básica
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Título del evento"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            required
                                            placeholder="Ej: Conversatorio sobre..."
                                        />
                                    </Grid>
                                    
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Tipo de evento</InputLabel>
                                            <Select
                                                value={formData.type}
                                                onChange={(e) => handleInputChange('type', e.target.value)}
                                                label="Tipo de evento"
                                            >
                                                {Object.entries(typeLabels).map(([key, label]) => (
                                                    <MenuItem key={key} value={key}>
                                                        {label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DatePicker
                                                label="Fecha del evento"
                                                value={formData.date}
                                                onChange={(newValue) => handleInputChange('date', newValue)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        required: true
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Imagen de Portada
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Esta será la imagen principal que se mostrará en la galería pública.
                                </Typography>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={uploadingCover ? <CircularProgress size={20} /> : <UploadIcon />}
                                        disabled={uploadingCover}
                                    >
                                        {uploadingCover ? 'Subiendo...' : 'Cambiar Imagen de Portada'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleCoverImageUpload}
                                        />
                                    </Button>
                                </Box>

                                {formData.coverImage && (
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src={formData.coverImage}
                                            alt="Portada"
                                            style={{
                                                width: '100%',
                                                maxWidth: 400,
                                                height: 250,
                                                objectFit: 'cover',
                                                borderRadius: 8,
                                                border: '1px solid #e0e0e0'
                                            }}
                                        />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Galería de Imágenes
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Agregue o elimine imágenes de la galería. Los usuarios podrán ver estas imágenes al hacer click en el evento.
                                </Typography>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={uploadingGallery ? <CircularProgress size={20} /> : <GalleryIcon />}
                                        disabled={uploadingGallery}
                                    >
                                        {uploadingGallery ? 'Subiendo...' : 'Agregar Más Imágenes'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryUpload}
                                        />
                                    </Button>
                                    
                                    {formData.gallery.length > 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {formData.gallery.length} imagen{formData.gallery.length !== 1 ? 'es' : ''} en galería
                                        </Typography>
                                    )}
                                </Box>

                                {formData.gallery.length > 0 ? (
                                    <ImageList cols={4} gap={8}>
                                        {formData.gallery.map((image, index) => (
                                            <ImageListItem key={index} sx={{ position: 'relative' }}>
                                                <img
                                                    src={image.url}
                                                    alt={`Galería ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: 150,
                                                        objectFit: 'cover',
                                                        borderRadius: 4
                                                    }}
                                                />
                                                <IconButton
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 255, 255, 1)'
                                                        }
                                                    }}
                                                    size="small"
                                                    onClick={() => removeGalleryImage(index)}
                                                >
                                                    <DeleteIcon fontSize="small" color="error" />
                                                </IconButton>
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                ) : (
                                    <Alert severity="info">
                                        No hay imágenes en la galería. Agregue al menos una imagen para que los usuarios puedan ver el contenido del evento.
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={() => navigate('/dashboard/eventos')}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                disabled={loading || !formData.title.trim() || !formData.coverImage || !hasChanges()}
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </Box>
                        
                        {!hasChanges() && originalData && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                No hay cambios para guardar
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </form>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={uploadingCover || uploadingGallery}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {uploadingCover ? 'Subiendo imagen de portada...' : 'Subiendo galería...'}
                    </Typography>
                </Box>
            </Backdrop>
        </Box>
    )
}