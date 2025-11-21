import * as React from 'react'
import {
    Box,
    Container,
    Typography,
    Button,
    Skeleton,
    Alert,
    Chip,
    Paper,
    Divider,
    IconButton,
    styled
} from '@mui/material'
import {
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    GetApp as GetAppIcon
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { reportService } from '../services/reportService'
import { brand } from '../../shared-theme/themePrimitives'

const HeroSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: 400,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: theme.spacing(3),
    overflow: 'hidden',
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
    }
}));

const DocumentBadge = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: theme.palette.primary.main,
    padding: '8px 16px',
    borderRadius: theme.spacing(1),
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    zIndex: 2,
    position: 'relative'
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    border: `1px solid ${brand.main}20`
}));

export default function InformeShow(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [report, setReport] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

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

    React.useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true)
                console.log('Cargando informe: ', id)

                const reportData = await reportService.getReportById(id)
                console.log('Informe cargado: ', reportData)

                setReport(reportData)
                setError('')
            } catch(err) {
                console.error('Error cargando informe: ', err)
                setError('Error al cargar el informe')
            } finally {
                setLoading(false)
            }
        }

        if (id){
            fetchReport()
        }
    }, [id])

    const handleDownload = async () => {
        if (!report) return

        try {
            await reportService.incrementDownloads(report._id)

            const link = document.createElement('a')
            link.href = report.pdfFile.url
            link.download = report.pdfFile.originalName || `${report.title}.pdf`
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch(error) {
            console.error('Error descargando archivo: ', error)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 4 }} />
                <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={40} sx={{ mb: 4 }} />
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 3 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Container>
        )
    }

    if (error || !report){
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error || 'Informe no encontrado'}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                >
                    Volver
                </Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 3 }}
            >
                Volver a informes
            </Button>

            <HeroSection sx={{ backgroundImage: `url(${report.coverImage})` }}>
                <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
                    <DocumentBadge>
                        📄 DOCUMENTO
                    </DocumentBadge>
                    <Typography variant="h2" component="h1" gutterBottom sx={{
                        fontWeight: 700,
                        fontSize: { xs: '2rem', md: '3rem' },
                        textShadow: '2px 4px 4px rgba(0, 0, 0, .5)'
                    }}>
                        {report.title}
                    </Typography>
                </Box>
            </HeroSection>

            <InfoCard>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ color: brand.main }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Fecha:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatDateForDisplay(report.date)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: brand.main }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {report.authors.length > 1 ? 'Autores:' : 'Autor:'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    {report.authors.map((author, index) => (
                        <Chip
                            key={index}
                            label={author.name}
                            variant="outlined"
                            sx={{
                                mr: 1,
                                mb: 1,
                                fontWeight: 500
                            }}
                        />
                    ))}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h5" component="h2" gutterBottom sx={{
                    color: brand.main,
                    fontWeight: 600,
                    mb: 2
                }}>
                    Introducción
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.7,
                        textAlign: 'justify',
                        fontSize: '1.1rem'
                    }}
                >
                    {report.introduction}
                </Typography>
            </InfoCard>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 2,
                py: 4
            }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: 3,
                        '&:hover': {
                            boxShadow: 6,
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all .3s ease'
                    }}
                >
                    Descargar PDF
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Archivo: {report.pdfFile.originalName}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                        Tamaño: {(report.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                    {report.downloads > 0 && (
                        <>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                                Descargas: {report.downloads}
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    )
}