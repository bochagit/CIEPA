import * as React from 'react'
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Alert,
    IconButton,
    LinearProgress,
    Card,
    CardMedia,
    CardActions,
    styled,
    Stack
} from '@mui/material'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    PictureAsPdf as PdfIcon,
    Image as ImageIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { uploadService } from '../services/uploadCloudinary'
import { reportService } from '../services/reportService'

const UploadBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
    '&.dragover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}08`,
        borderStyle: 'solid',
    }
}))

const UploadIconContainer = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: `${theme.palette.primary.main}10`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
}))

export default function ReportEdit() {
    const navigate = useNavigate()
    const { reportId } = useParams()
    const imageInputRef = React.useRef(null)
    const pdfInputRef = React.useRef(null)

    const [formData, setFormData] = React.useState({
        title: '',
        introduction: '',
        date: new Date().toISOString().split('T')[0],
        authors: [{ name: '' }],
    })
    const [originalData, setOriginalData] = React.useState(null)
    const [coverImage, setCoverImage] = React.useState(null)
    const [coverPreview, setCoverPreview] = React.useState('')
    const [pdfFile, setPdfFile] = React.useState(null)
    const [existingPdfData, setExistingPdfData] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [loadingData, setLoadingData] = React.useState(true)
    const [uploadProgress, setUploadProgress] = React.useState({ image: 0, pdf: 0 })
    const [errors, setErrors] = React.useState({})

    const showNotification = (message, options = {}) => {
        if (options.severity === 'error') {
            alert('Error: ' + message)
        } else if (options.severity === 'success') {
            alert('Éxito: ' + message)
        } else {
            alert(message)
        }
    }

    const triggerImageSelect = () => {
        imageInputRef.current?.click()
    }

    const triggerPdfSelect = () => {
        pdfInputRef.current?.click()
    }

    React.useEffect(() => {
        const loadReportData = async () => {
            try {
                setLoadingData(true)
                
                const report = await reportService.getReportById(reportId)

                const formatDateSafely = (dateInput) => {
                    if (!dateInput) return new Date().toISOString().split('T')[0]
                    
                    try {
                        if (typeof dateInput === 'string'){
                            if(/^\d{4}-\d{2}-\d{2}$/.test(dateInput)){
                                return dateInput
                            }
                            
                            if(dateInput.includes('T')){
                                const dateOnly = dateInput.split('T')[0]
                                return dateOnly
                            }
                        }

                        if (dateInput instanceof Date){
                            return dateInput.toISOString().split('T')[0]
                        }
                    } catch(error) {
                        console.warn('Error parseando fecha: ', error)
                        return new Date().toISOString().split('T')[0]
                    }

                    return new Date().toISOString().split('T')[0]
                }
                
                setOriginalData(report)
                setFormData({
                    title: report.title || '',
                    introduction: report.introduction || '',
                    date: formatDateSafely(report.date),
                    authors: report.authors?.length > 0 ? report.authors : [{ name: '' }],
                })
                
                if (report.coverImage) {
                    setCoverPreview(report.coverImage)
                }
                
                if (report.pdfFile) {
                    setExistingPdfData(report.pdfFile)
                }
                
            } catch (error) {
                console.error('Error cargando informe:', error)
                showNotification('Error al cargar el informe', { severity: 'error' })
                navigate('/dashboard/informes')
            } finally {
                setLoadingData(false)
            }
        }

        if (reportId) {
            loadReportData()
        }
    }, [reportId, navigate])

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleAuthorChange = (index, value) => {
        const newAuthors = [...formData.authors]
        newAuthors[index] = { name: value }
        setFormData(prev => ({ ...prev, authors: newAuthors }))
    }

    const addAuthor = () => {
        setFormData(prev => ({
            ...prev,
            authors: [...prev.authors, { name: '' }]
        }))
    }

    const removeAuthor = (index) => {
        if (formData.authors.length > 1) {
            const newAuthors = formData.authors.filter((_, i) => i !== index)
            setFormData(prev => ({ ...prev, authors: newAuthors }))
        }
    }

    const handleImageSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            setCoverImage(file)
            setCoverPreview(URL.createObjectURL(file))
        }
    }

    const handlePdfSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.type === 'application/pdf') {
                setPdfFile(file)
                setExistingPdfData(null)
            } else {
                showNotification('Solo se permiten archivos PDF', { severity: 'error' })
            }
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) newErrors.title = 'El título es requerido'
        if (!formData.introduction.trim()) newErrors.introduction = 'La introducción es requerida'
        if (!formData.date) newErrors.date = 'La fecha es requerida'
        
        if (!coverImage && !coverPreview) {
            newErrors.coverImage = 'La imagen de portada es requerida'
        }

        if (!pdfFile && !existingPdfData) {
            newErrors.pdfFile = 'El archivo PDF es requerido'
        }
        
        const validAuthors = formData.authors.filter(author => author.name.trim())
        if (validAuthors.length === 0) {
            newErrors.authors = 'Al menos un autor es requerido'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!validateForm()) {
            showNotification('Por favor completa todos los campos requeridos', { severity: 'error' })
            return
        }

        setLoading(true)

        try {
            let finalCoverImage = originalData.coverImage
            let finalPdfFile = originalData.pdfFile

            if (coverImage) {
                if (originalData.coverImage) {
                    try {
                        await uploadService.deleteImageByUrl(originalData.coverImage)
                    } catch (error) {
                        console.warn('No se pudo eliminar imagen anterior:', error)
                    }
                }
                
                const imageResult = await uploadService.uploadReportImage(coverImage)
                finalCoverImage = imageResult.url
            }

            if (pdfFile) {
                if (originalData.pdfFile?.url) {
                    try {
                        await uploadService.deleteFileByUrl(originalData.pdfFile.url)
                    } catch (error) {
                        console.warn('No se pudo eliminar PDF anterior:', error)
                    }
                }
                
                const pdfResult = await uploadService.uploadPDF(pdfFile, (progress) => {
                    setUploadProgress(prev => ({ ...prev, pdf: progress }))
                })
                
                finalPdfFile = {
                    url: pdfResult.url,
                    publicId: pdfResult.publicId,
                    originalName: pdfResult.originalName,
                    size: pdfResult.size
                }
            }

            const validAuthors = formData.authors.filter(author => author.name.trim())
            const updateData = {
                title: formData.title.trim(),
                introduction: formData.introduction.trim(),
                authors: validAuthors,
                date: formData.date,
                coverImage: finalCoverImage,
                pdfFile: finalPdfFile,
            }

            const response = await reportService.updateReport(reportId, updateData)

            if (response.success) {
                navigate('/dashboard/informes')
            }

        } catch (error) {
            console.error('Error actualizando informe:', error)
            showNotification(error.message || 'Error al actualizar el informe', { severity: 'error' })
        } finally {
            setLoading(false)
            setUploadProgress({ image: 0, pdf: 0 })
        }
    }

    const handleBack = () => {
        navigate('/dashboard/informes')
    }

    if (loadingData) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Typography>Cargando datos del informe...</Typography>
                </Box>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Volver
                    </Button>
                </Stack>
                
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Editar Informe
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Modifica la información del informe y sus archivos asociados.
                </Typography>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Título del Informe"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                error={!!errors.title}
                                helperText={errors.title}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth
                                label="Fecha"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                error={!!errors.date}
                                helperText={errors.date}
                                disabled={loading}
                                required
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Autores
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Agrega los autores del informe. Puedes agregar múltiples autores.
                            </Typography>
                            
                            {formData.authors.map((author, index) => (
                                <Box key={index} sx={{ 
                                    display: 'flex', 
                                    gap: 1, 
                                    mb: 1,
                                    p: 2,
                                    backgroundColor: 'action.hover',
                                    borderRadius: 1,
                                    alignItems: 'center'
                                }}>
                                    <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                    <TextField
                                        fullWidth
                                        label={`Autor ${index + 1}`}
                                        value={author.name}
                                        onChange={(e) => handleAuthorChange(index, e.target.value)}
                                        disabled={loading}
                                        size="small"
                                    />
                                    <IconButton
                                        onClick={() => removeAuthor(index)}
                                        disabled={formData.authors.length === 1 || loading}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addAuthor}
                                disabled={loading}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            >
                                Agregar Autor
                            </Button>
                            
                            {errors.authors && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {errors.authors}
                                </Alert>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                label="Introducción"
                                name="introduction"
                                value={formData.introduction}
                                onChange={handleInputChange}
                                error={!!errors.introduction}
                                helperText={errors.introduction}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Imagen de Portada
                            </Typography>
                            
                            {coverPreview ? (
                                <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={coverPreview}
                                        alt="Portada"
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardActions sx={{ justifyContent: 'center', py: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ImageIcon />}
                                            disabled={loading}
                                            onClick={triggerImageSelect}
                                            sx={{ fontWeight: 500 }}
                                        >
                                            Cambiar Imagen
                                        </Button>
                                    </CardActions>
                                </Card>
                            ) : (
                                <UploadBox onClick={triggerImageSelect}>
                                    <UploadIconContainer>
                                        <ImageIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                    </UploadIconContainer>
                                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                                        Subir imagen de portada
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        JPG, PNG o GIF hasta 5MB
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ pointerEvents: 'none' }}
                                    >
                                        Seleccionar archivo
                                    </Button>
                                </UploadBox>
                            )}
                            <input
                                ref={imageInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageSelect}
                            />

                            {errors.coverImage && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {errors.coverImage}
                                </Alert>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Archivo PDF
                            </Typography>

                            {pdfFile ? (
                                <Box sx={{ 
                                    p: 3, 
                                    border: '2px solid', 
                                    borderColor: 'warning.main',
                                    borderRadius: 2,
                                    backgroundColor: 'warning.main + "08"'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PdfIcon sx={{ fontSize: 48, color: 'error.main', mr: 2 }} />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {pdfFile.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB (nuevo archivo)
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            onClick={() => setPdfFile(null)}
                                            disabled={loading}
                                            color="error"
                                            sx={{ ml: 1 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                    
                                    {uploadProgress.pdf > 0 && uploadProgress.pdf < 100 && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Subiendo: {uploadProgress.pdf}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={uploadProgress.pdf}
                                                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            ) : existingPdfData ? (
                                <Box sx={{
                                    p: 3,
                                    border: '2px solid',
                                    borderColor: 'success.main',
                                    borderRadius: 2,
                                    backgroundColor: 'action.hover'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PdfIcon sx={{ fontSize: 48, color: 'error.main', mr: 2 }} />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {existingPdfData.originalName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {(existingPdfData.size / 1024 / 1024).toFixed(2)} MB (archivo actual)
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        startIcon={<UploadIcon />}
                                        disabled={loading}
                                        onClick={triggerPdfSelect}
                                        size="small"
                                    >
                                        Reemplazar PDF
                                        <input
                                            type="file"
                                            hidden
                                            accept=".pdf,application/pdf"
                                            onChange={handlePdfSelect}
                                        />
                                    </Button>
                                </Box>
                            ) : (
                                <UploadBox onClick={triggerPdfSelect}>
                                    <UploadIconContainer>
                                        <PdfIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                    </UploadIconContainer>
                                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                                        Subir archivo PDF
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Documento PDF hasta 50MB
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ pointerEvents: 'none' }}
                                    >
                                        Seleccionar archivo
                                    </Button>
                                </UploadBox>
                            )}

                            <input
                                ref={pdfInputRef}
                                type="file"
                                hidden
                                accept=".pdf,application/pdf"
                                onChange={handlePdfSelect}
                            />

                            {errors.pdfFile && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {errors.pdfFile}
                                </Alert>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={loading ? null : <UploadIcon />}
                                    disabled={loading}
                                >
                                    {loading ? 'Actualizando...' : 'Guardar Cambios'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}