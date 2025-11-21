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
    Chip,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { uploadService } from '../services/uploadCloudinary'
import { reportService } from '../services/reportService'
import useNotifications from '../hooks/useNotifications/useNotifications'

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

export default function ReportCreate() {
    const navigate = useNavigate()
    const notifications = useNotifications()

    const [formData, setFormData] = React.useState({
        title: '',
        introduction: '',
        date: null,
        authors: [{ name: '' }]
    })
    const [coverImage, setCoverImage] = React.useState(null)
    const [coverPreview, setCoverPreview] = React.useState('')
    const [pdfFile, setPdfFile] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [uploadProgress, setUploadProgress] = React.useState({ image: 0, pdf: 0 })
    const [errors, setErrors] = React.useState({})

    const handleInputChange = (field, value) => {
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
                date: formData.date,
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
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Título del Informe"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha"
                                    value={formData.date}
                                    onChange={(date) => handleInputChange('date', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={!!errors.date}
                                            helperText={errors.date}
                                        />
                                    )}
                                    disabled={loading}
                                />
                            </LocalizationProvider>
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
                                rows={4}
                                label="Introducción"
                                value={formData.introduction}
                                onChange={(e) => handleInputChange('introduction', e.target.value)}
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
                                            component="label"
                                            variant="outlined"
                                            startIcon={<ImageIcon />}
                                            disabled={loading}
                                            sx={{ fontWeight: 500 }}
                                        >
                                            Cambiar Imagen
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                            />
                                        </Button>
                                    </CardActions>
                                </Card>
                            ) : (
                                <UploadBox component="label">
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
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                </UploadBox>
                            )}

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
                                    backgroundColor: 'success.main + "08"'
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
                                <UploadBox component="label">
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
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,application/pdf"
                                        onChange={handlePdfSelect}
                                    />
                                </UploadBox>
                            )}

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