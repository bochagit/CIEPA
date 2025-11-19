import * as React from 'react'
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
    Backdrop
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    PhotoLibrary as GalleryIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../services/eventService'
import { uploadService } from '../services/uploadCloudinary'

export default function EventCreate(){
    const [formData, setFormData] = React.useState({
        title: '',
        type: '',
        date: new Date(),
        coverImage: '',
        gallery: []
    })
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')
    const [uploadingCover, setUploadingCover] = React.useState(false)
    const [uploadingGallery, setUploadingGallery] = React.useState(false)

    const [uploadedCoverImage, setUploadedCoverImage] = React.useState(null)
    const [uploadedGalleryImages, setUploadedGalleryImages] = React.useState([])

    const navigate = useNavigate()

    const typeLabels = {
        conversatorio: 'Conversatorios',
        formacion: 'Ciclo de formaciones',
        jornada: 'Jornadas'
    }

    const handleInputChange = (field, value) => {
        console.log(`handleInputChange: ${field} =`, value)

        if (field === 'coverImage'){
            console.log('Cambio en cover image')
            console.log('Valor anterior: ', formData.coverImage)
            console.log('Valor nuevo: ', value)
            console.log('Stack trace: ', new Error().stack.split('\n').slice(1, 4).join('\n'))
            console.log('Fin cambio cover\n')
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (error) setError('')
    }

    const handleCoverImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        console.log('HandleCoverImageUpload Ejecutado')
        console.log('¿Quien llamo esta funcion?', new Error().stack)

        const previousImage = formData.coverImage
        const previousTrackedImage = uploadedCoverImage

        try {
            setUploadingCover(true)
            setError('')

            console.log('Subiendo portada')
            console.log('Imagen anterior: ', previousImage)
            console.log('Imagen trackeada anterior: ', previousTrackedImage)

            const uploadedImage = await uploadService.uploadEventImage(file)
            console.log('Nueva imagen subida: ', uploadedImage.url)

            handleInputChange('coverImage', uploadedImage.url)
            setUploadedCoverImage(uploadedImage.url)

            console.log('Evaluando si eliminar anterior')
            console.log('PreviousImage: ', previousImage)
            console.log('PreviousTrackedImage: ', previousTrackedImage)
            console.log('¿Son iguales?: ', previousImage === previousTrackedImage)
            console.log('¿Ambos existen?: ', Boolean(previousImage && previousTrackedImage))

            if (previousImage && previousTrackedImage && previousImage === previousTrackedImage){
                console.log('Eliminando imagen anterior')
                console.log('Eliminando: ', previousImage)

                try {
                    await uploadService.deleteImageByUrl(previousImage)
                    console.log('Imagen anterior eliminada exitosamente')
                } catch(deleteError) {
                    console.warn('No se pudo eliminar imagen anterior: ', deleteError.message)
                }
            } else {
                console.log('No se elimina imagen anterior')
                console.log('Razón: no cumple condiciones para eliminación')
            }

            console.log('Fin subida portada')
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

        console.log('Handle gallery upload ejecutado')
        console.log('Archivos a subir: ', files.length)
        console.log('imagen portada Antes: ', formData.coverImage)
        console.log('Portada trackeada Antes: ', uploadedCoverImage)
        
        try {
            setUploadingGallery(true)
            setError('')

            console.log('Iniciando subida de galería...')
            const uploadedGallery = await uploadService.uploadEventGallery(files)

            const newGalleryImages = uploadedGallery.images.map((img, index) => ({
                url: img.url,
                order: formData.gallery.length + index
            }))

            console.log('Nuevas imagenes de galería: ', newGalleryImages.length)
            console.log('Actualizando galería en formData...')

            handleInputChange('gallery', [...formData.gallery, ...newGalleryImages])

            const newUrls = uploadedGallery.images.map(img => img.url)
            setUploadedGalleryImages(prev => {
                const updated = [...prev, ...newUrls]
                console.log('Tracking galería actualizado: ', updated.length)
                return updated
            })

            console.log('Imagen portada Despues: ', formData.coverImage)
            console.log('Portada trackeada Despues: ', uploadedCoverImage)
            console.log('Fin gallery upload')
        } catch(err) {
            setError('Error al subir imágenes de galería: ' + err.message)
            console.error(err)
        } finally {
            setUploadingGallery(false)
        }
    }

    const removeGalleryImage = async (index) => {
        const imageToRemove = formData.gallery[index]

        console.log('Eliminando imagen galería')
        console.log('Indice: ', index)
        console.log('Imagen a eliminar: ', imageToRemove.url)
        console.log('Total en galería: ', formData.gallery.length)
        console.log('Total trackeadas: ', uploadedGalleryImages.length)
        console.log('Esta en tracking: ', uploadedGalleryImages.includes(imageToRemove.url))

        if (uploadedGalleryImages.includes(imageToRemove.url)){
            try{
                await uploadService.deleteImageByUrl(imageToRemove.url)
                setUploadedGalleryImages(prev => {
                    const filtered = prev.filter(url => url !== imageToRemove.url)
                    console.log('Tracking actualizado: ', filtered.length, 'imagenes restantes')
                    return filtered
                })
            } catch(error) {
                console.warn('No se pudo eliminar imagen de Cloudinary: ', error.message)
            }
        } else {
            console.log('Imagen no está en tracking - removiendo localmente')
        }

        const newGallery = formData.gallery.filter((_, i) => i !== index)
        const reorderedGallery = newGallery.map((img, i) => ({ ...img, order: i }))
        handleInputChange('gallery', reorderedGallery)
    }

    const validateForm = () => {
        if (!formData.title.trim()){
            setError('El título es requerido')
            return false
        }

        if (!formData.coverImage){
            setError('La imagen de portada es requerida')
            return false
        }

        if (!formData.date){
            setError('La fecha es requerida')
            return false
        }

        return true
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
            }

            await eventService.createEvent(eventData)

            setUploadedCoverImage(null)
            setUploadedGalleryImages([])

            navigate('/dashboard/eventos', {
                state: {
                    message: `Evento "${formData.title}" creado exitosamente`
                }
            })
        } catch(err) {
            setError('Error al crear evento: ' + err.message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        if (uploadedCoverImage){
            try {
                await uploadService.deleteImageByUrl(uploadedCoverImage)
            } catch(error) {
                console.warn('Error eliminando imagen de portada: ', error.message)
            }
        }

        if (uploadedGalleryImages.length > 0){
            const deletePromises = uploadedGalleryImages.map(async (imageUrl) => {
                try {
                    await uploadService.deleteImageByUrl(imageUrl)
                } catch(error) {
                    console.warn('Error eliminando imagen de galería: ', error.message)
                }
            })

            await Promise.allSettled(deletePromises)
        }

        navigate('/dashboard/eventos')
    }

    React.useEffect(() => {
        console.log('Cambio en uploadedCoverImage')
        console.log('Nuevo valor: ', uploadedCoverImage)
        console.log('Stack trace: ', new Error().stack.split('\n').slice(1, 4).join('\n'))
        console.log('Fin cambio\n')
    }, [uploadedCoverImage])

    React.useEffect(() => {
        console.log('Cambio en formData.coverImage')
        console.log('Nuevo valor: ', formData.coverImage)
        console.log('Fin cambio\n')
    }, [formData.coverImage])

    React.useEffect(() => {
        return () => {
            console.log('Cleanup al desmontar')

            const currentUploadedCover = uploadedCoverImage
            const currentUploadedGallery = [...uploadedGalleryImages]

            console.log('Imagen portada a limpiar: ', currentUploadedCover)
            console.log('Imagenes galería a limpiar: ', currentUploadedGallery.length)

            const allUploadedImages = [
                currentUploadedCover,
                ...currentUploadedGallery
            ].filter(Boolean)

            if (allUploadedImages.length > 0){
                console.log('Limpiando', allUploadedImages.length, 'imágenes')
                allUploadedImages.forEach(async (imageUrl) => {
                    try {
                        console.log('Eliminando en cleanup: ', imageUrl)
                        await uploadService.deleteImageByUrl(imageUrl)
                        console.log('Eliminada en cleanup: ', imageUrl)
                    } catch(error) {
                        console.warn('Error en cleanup: ', error.message)
                    }
                })
            } else {
                console.log('No hay imágenes para limpiar')
            }
            console.log('Fin cleanup')
        }
    }, [])

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Crear Nuevo Evento
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Complete la información del evento y suba las imágenes correspondientes.
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
                                    Información básica
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Título del evento"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            required
                                            placeholder="Ej.: Conversatorio sobre..."
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

                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                    Imagen de portada
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Esta será la imagen principal de la galería pública.
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={uploadingCover ? <CircularProgress size={20} /> : <UploadIcon />}
                                        disabled={uploadingCover}
                                    >
                                        {uploadingCover ? 'Subiendo...' : 'Subir imagen de portada'}
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
                                    Galería de imágenes
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Agregue todas las imágenes del evento. Los usuarios podrán ver estas imágenes al hacer click en el mismo.
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={uploadingGallery ? <CircularProgress size={20} /> : <GalleryIcon />}
                                        disabled={uploadingGallery}
                                    >
                                        {uploadingGallery ? 'Subiendo...' : 'Agregar imágenes a galería'}
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

                                {formData.gallery.length > 0 && (
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
                                                        backgroundColor: 'rgba(255, 255, 255, .9)',
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
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                disabled={loading || !formData.title.trim() || !formData.coverImage}
                            >
                                {loading ? 'Creando...' : 'Crear evento'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={uploadingCover || uploadingGallery}>
                <Box sx={{ textAling: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {uploadingCover ? 'Subiendo imagen de portada...' : 'Subiendo galería...'}
                    </Typography>
                </Box>
            </Backdrop>
        </Box>
    )
}