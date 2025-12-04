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
        gallery: [],
        instagramLink: ''
    })
    const [originalData, setOriginalData] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [loadingEvent, setLoadingEvent] = React.useState(true)
    const [error, setError] = React.useState('')
    const [uploadingCover, setUploadingCover] = React.useState(false)
    const [uploadingGallery, setUploadingGallery] = React.useState(false)
    const [uploadedCoverImage, setUploadedCoverImage] = React.useState(null)
    const [originalCoverImage, setOriginalCoverImage] = React.useState(null)
    const [uploadedGalleryImages, setUploadedGalleryImages] = React.useState([])
    const [originalGalleryImages, setOriginalGalleryImages] = React.useState([])
    const [removedOriginalImages, setRemovedOriginalImages] = React.useState([])

    const navigate = useNavigate()
    const { eventId } = useParams()

    const isEditing = Boolean(eventId && originalData)

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

                const formatEventDate = (dateInput) => {
                    if (!dateInput) return new Date().toISOString().split('T')[0]
                    
                    if (typeof dateInput === 'string') {
                        if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
                            return dateInput
                        }
                        if (dateInput.includes('T')) {
                            return dateInput.split('T')[0]
                        }
                    }
                    
                    if (dateInput instanceof Date) {
                        return dateInput.toISOString().split('T')[0]
                    }
                    
                    return new Date().toISOString().split('T')[0]
                }
                
                const eventData = {
                    title: event.title,
                    type: event.type,
                    date: formatEventDate(event.date),
                    coverImage: event.coverImage,
                    gallery: event.gallery || [],
                    instagramLink: event.instagramLink || ''
                }
                
                setFormData(eventData)
                setOriginalData(eventData)
                
                if (event.coverImage){
                    setOriginalCoverImage(event.coverImage)
                    console.log('Imagen portada original: ', event.coverImage)
                }

                if (event.gallery && event.gallery.length > 0){
                    const galleryUrls = event.gallery.map(img => img.url)
                    setOriginalGalleryImages(galleryUrls)
                    console.log('Galería original: ', galleryUrls.length, 'imágenes')
                    galleryUrls.forEach((url, index) => {
                        console.log(` ${index + 1}. ${url}`)
                    })
                }

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

        const previousImage = formData.coverImage
        const previousTrackedImage = uploadedCoverImage

        try {
            setUploadingCover(true)
            setError('')
            const uploadedImage = await uploadService.uploadEventImage(file)
            handleInputChange('coverImage', uploadedImage.url)
            setUploadedCoverImage(uploadedImage.url)

            if (previousImage && previousTrackedImage && previousImage === previousTrackedImage && previousTrackedImage !== originalCoverImage){
                try {
                    await uploadService.deleteImageByUrl(previousImage)
                } catch(deleteError) {
                    console.warn('No se pudo eliminar imagen anterior: ', deleteError.message)
                }
            } else if (previousImage === originalCoverImage){
                console.log('Imagen anterior es original - no se elimina')
            }

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

            const newUrls = uploadedGallery.images.map(img => img.url)
            setUploadedGalleryImages(prev => [...prev, ...newUrls])
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
        console.log('Índice: ', index)
        console.log('Imagen a eliminar: ', imageToRemove.url)
        console.log('Total en galería: ', formData.gallery.length)
        console.log('Total trackeadas nuevas: ', uploadedGalleryImages.length)
        console.log('Total originales: ', originalGalleryImages.length)

        const isNewImage = uploadedGalleryImages.includes(imageToRemove.url)
        const isOriginalImage = originalGalleryImages.includes(imageToRemove.url)

        console.log('Es imagen nueva: ', isNewImage)
        console.log('Es imagen original: ', isOriginalImage)

        if (isNewImage){
            try {
                console.log('Eliminando imagen nueva de cloudinary: ', imageToRemove.url)
                await uploadService.deleteImageByUrl(imageToRemove.url)
                console.log('Imagen nueva eliminada de Cloudinary')

                setUploadedGalleryImages(prev => {
                    const filtered = prev.filter(url => url !== imageToRemove.url)
                    console.log('Tracking nuevas actualizado: ', filtered.length, 'restantes')
                    return filtered
                })
            } catch(error) {
                console.warn('No se pudo eliminar imagen de Cloudinary: ', error.message)
            }
        } else if (isOriginalImage){
            console.log('Imagen original - solo se remueve del formulario')

            setRemovedOriginalImages(prev => {
                if(!prev.includes(imageToRemove.url)){
                    const updated = [...prev, imageToRemove.url]
                    console.log('Originales eliminadas: ', updated.length)
                    return updated
                }
                return prev
            })

            console.log('Se eliminará de Cloudinary al guardar cambios')
        }

        const newGallery = formData.gallery.filter((_, i) => i !== index)
        const reorderedGallery = newGallery.map((img, i) => ({ ...img, order: i }))
        handleInputChange('gallery', reorderedGallery)

        console.log('Nueva galería local: ', reorderedGallery.length, 'imágenes')
        console.log('Fin eliminación galería\n')
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
            formData.date !== originalData.date ||
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

            console.log('Guardando cambios evento')
            console.log('Imagenes originales eliminadas: ', removedOriginalImages.length)

            const eventData = {
                ...formData,
                title: formData.title.trim(),
            }

            if (removedOriginalImages.length > 0){
                console.log('Eliminando imágenes originales removidas...')
                const deletePromises = removedOriginalImages.map(async (imageUrl) => {
                    try {
                        console.log('Eliminando imagen original: ', imageUrl)
                        await uploadService.deleteImageByUrl(imageUrl)
                        console.log('Imagen original eliminada: ', imageUrl)
                    } catch(error) {
                        console.warn('Error eliminando imagen original: ', imageUrl, error.message)
                    }
                })

                await Promise.allSettled(deletePromises)
                console.log('Proceso de eliminación de originales completado')
            }

            await eventService.updateEvent(eventId, eventData)

            setUploadedCoverImage(null)
            setUploadedGalleryImages([])
            setOriginalCoverImage(null)
            setOriginalGalleryImages([])
            setRemovedOriginalImages([])

            console.log('Guardado exitoso\n')
            
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

    const handleCancel = async () => {
        console.log('Cancelando edición')
        console.log('Imagen portada nueva: ', uploadedCoverImage)
        console.log('Imagenes galería nuevas: ', uploadedGalleryImages.length)
        console.log('Originales eliminadas (no se eliminarán): ', removedOriginalImages.length)

        if (uploadedCoverImage && uploadedCoverImage !== originalCoverImage){
            try {
                console.log('Eliminando imagen portada nueva al cancelar: ', uploadedCoverImage)
                await uploadService.deleteImageByUrl(uploadedCoverImage)
                console.log('Imagen portada nueva eliminada')
            } catch(error) {
                console.warn('Error eliminando imagen portada: ', error.message)
            }
        }

        if (uploadedGalleryImages.length > 0){
            console.log('Eliminando imágenes galería nuevas al cancelar...')
            const deletePromises = uploadedGalleryImages.map(async (imageUrl) => {
                try {
                    await uploadService.deleteImageByUrl(imageUrl)
                    console.log('Imagen galería nueva eliminada: ', imageUrl)
                } catch(error) {
                    console.warn('Error elminando imagen galería: ', error.message)
                }
            })

            await Promise.allSettled(deletePromises)
        }

        console.log('Imágenes originales eliminadas se restauran al cancelar')

        console.log('Fin cancelación\n')
        navigate('/dashboard/eventos')
    }

    React.useEffect(() => {
        return () => {
            const newImages = [
                ...(uploadedCoverImage && uploadedCoverImage !== originalCoverImage ? [uploadedCoverImage] : []),
                ...uploadedGalleryImages
            ]

            if (newImages.length > 0){
                console.log('Limpieza al desmontar - imágenes nuevas: ', newImages.length)
                newImages.forEach(async (imageUrl) => {
                    try {
                        await uploadService.deleteImageByUrl(imageUrl)
                        console.log('Imagen nueva eliminada en cleanup: ', imageUrl)
                    } catch(error) {
                        console.warn('Error en cleanup: ', error.message)
                    }
                })
            }

            if (removedOriginalImages.length > 0){
                console.log('Cleanup - No eliminado', removedOriginalImages.length, 'originales (solo al guardar)')
            }
        }
    }, [uploadedCoverImage, originalCoverImage, uploadedGalleryImages, removedOriginalImages])

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
                                    
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Fecha del evento"
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            required
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Link de Instagram (opcional)"
                                            value={formData.instagramLink}
                                            onChange={(e) => handleInputChange('instagramLink', e.target.value)}
                                            placeholder="https://www.instagram.com/p/..."
                                        />
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
                                onClick={handleCancel}
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