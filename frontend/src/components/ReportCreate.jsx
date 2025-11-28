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
    styled
} from '@mui/material'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    PictureAsPdf as PdfIcon,
    Image as ImageIcon,
    Person as PersonIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { uploadService } from '../services/uploadCloudinary'
import { reportService } from '../services/reportService'
import useNotifications from '../hooks/useNotifications/useNotifications'
import { format, parseISO } from 'date-fns'

const UploadBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
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

export default function ReportCreate() {
    const navigate = useNavigate()
    const notifications = useNotifications()
    const imageInputRef = React.useRef(null)
    const pdfInputRef = React.useRef(null)

    const [formData, setFormData] = React.useState({
        title: '',
        introduction: '',
        date: new Date().toISOString().split('T')[0],
        authors: [{ name: '' }]
    })
    const [coverImage, setCoverImage] = React.useState(null)
    const [coverPreview, setCoverPreview] = React.useState('')
    const [pdfFile, setPdfFile] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [uploadProgress, setUploadProgress] = React.useState({ image: 0, pdf: 0 })
    const [errors, setErrors] = React.useState({})

    const triggerImageSelect = () => {
        imageInputRef.current?.click()
    }

    const triggerPdfSelect = () => {
        pdfInputRef.current?.click()
    }

    const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    };

    const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
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
            } else {
                notifications.show('Solo se permiten archivos PDF', { severity: 'error' })
            }
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) newErrors.title = 'El título es requerido'
        if (!formData.introduction.trim()) newErrors.introduction = 'La introducción es requerida'
        if (!formData.date) newErrors.date = 'La fecha es requerida'
        if (!coverImage) newErrors.coverImage = 'La imagen de portada es requerida'
        if (!pdfFile) newErrors.pdfFile = 'El archivo PDF es requerido'
        
        const validAuthors = formData.authors.filter(author => author.name.trim())
        if (validAuthors.length === 0) newErrors.authors = 'Al menos un autor es requerido'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!validateForm()) {
            notifications.show('Por favor completa todos los campos requeridos', { severity: 'error' })
            return
        }

        setLoading(true)

        const formatDateSafely = (dateInput) => {
            if (!dateInput) return format(new Date(), 'yyyy-MM-dd')

            console.log('Procesando fecha original: ', dateInput)
            
            try {
            if (typeof dateInput === 'string'){
                if(/^\d{4}-\d{2}-\d{2}$/.test(dateInput)){
                console.log('Fecha ya en formato correcto: ', dateInput)
                return dateInput
                }
                
                if(dateInput.includes('T')){
                const dateOnly = dateInput.split('T')[0]
                console.log('Fecha extraída sin conversión: ', dateOnly)
                return dateOnly
                }

                console.log('Usando parseISO como último recurso')
                const parsed = parseISO(dateInput)
                return format(parsed, 'yyyy-MM-dd')
            }

                if (dateInput instanceof Date){
                console.log('Formateando objeto Date')
                return format(dateInput, 'yyyy-MM-dd')
                }
            } catch(error) {
            console.warn('Error parseando fecha: ', error)
            return format(new Date(), 'yyyy-MM-dd')
            }

            return format(new Date(), 'yyyy-MM-dd')
        }

        try {
            notifications.show('Subiendo archivos...', { severity: 'info', autoHideDuration: null })

            const imageResult = await uploadService.uploadReportImage(coverImage)

            const pdfResult = await uploadService.uploadPDF(pdfFile, (progress) => {
                setUploadProgress(prev => ({ ...prev, pdf: progress }))
            })

            notifications.show('Creando informe...', { severity: 'info' })

            const validAuthors = formData.authors.filter(author => author.name.trim())
            const reportData = {
                title: formData.title.trim(),
                introduction: formData.introduction.trim(),
                authors: validAuthors,
                date: formatDateSafely(formData.date),
                coverImage: imageResult.url,
                pdfFile: {
                    url: pdfResult.url,
                    publicId: pdfResult.publicId,
                    originalName: pdfResult.originalName,
                    size: pdfResult.size
                }
            }

            const response = await reportService.createReport(reportData)

            if (response.success) {
                notifications.show('Informe creado exitosamente', { severity: 'success' })
                navigate('/dashboard/informes')
            }

        } catch (error) {
            console.error('Error creando informe:', error)
            notifications.show(error.message || 'Error al crear el informe', { severity: 'error' })
        } finally {
            setLoading(false)
            setUploadProgress({ image: 0, pdf: 0 })
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Crear Nuevo Informe
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Completa la información y sube los archivos necesarios para crear el informe.
                </Typography>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                name="title"
                                label="Título del Informe"
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
                            <Typography variant="h6" gutterBottom>
                                Autores
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Agregá los autores del informe. podes agregar múltiples autores.
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
                                <Alert severity="error" sx={{ mt: 1 }}>
                                    {errors.authors}
                                </Alert>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              multiline
                              minRows={3}
                              maxRows={10}
                              label="Introducción"
                              name="introduction"
                              placeholder="Escribí una introducción al infrome..."
                              value={formData.introduction}
                              onChange={handleInputChange}
                              error={!!errors.introduction}
                              helperText={errors.introduction || "Describí el informe."}
                              disabled={loading}
                              required
                              sx={{
                                '& .MuiInputBase-root': {
                                    alignItems: 'flex-start',
                                    height: 'auto',
                                    minHeight: 'auto',
                                    padding: '12px',
                                },
                                '& .MuiInputBase-input': {
                                    height: 'auto !important',
                                    overflow: 'auto !important',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word'
                                },
                                '& textarea': {
                                    resize: 'none',
                                    lineHeight: 1.5
                                }
                                }}
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
                                <Alert severity="error" sx={{ mt: 1 }}>
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
                                    borderColor: 'success.main',
                                    borderRadius: 2,
                                    backgroundColor: 'action.hover'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PdfIcon sx={{ fontSize: 48, color: 'error.main', mr: 2 }} />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {pdfFile.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
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
                                <Alert severity="error" sx={{ mt: 1 }}>
                                    {errors.pdfFile}
                                </Alert>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/dashboard/informes')}
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
                                    {loading ? 'Creando...' : 'Crear Informe'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}