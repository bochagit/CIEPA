import * as React from 'react'
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Skeleton,
    Alert,
    Chip,
    IconButton,
    styled
} from '@mui/material'
import {
    Download as DownloadIcon,
    Visibility as ViewIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { reportService } from '../services/reportService'
import { brand } from '../../shared-theme/themePrimitives'

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

const ReportCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  position: 'relative',
  overflow: 'hidden'
}));

const DocumentBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: 4,
  fontSize: '0.75rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  zIndex: 2
}));

export default function Informes(){
    const navigate = useNavigate()
    const [reports, setReports] = React.useState([])
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
    const fetchReports = async () => {
        try {
            setLoading(true)
            const response = await reportService.getAllReports()

            if (response.success){
                setReports(response.reports)
            }

            setError('')
        } catch(err) {
            setError('Error al cargar informes')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    fetchReports()
  }, [])

  const handleReportClick = (reportId) => {
    navigate(`/informes/${reportId}`)
  }

  const handleDownload = async (e, report) => {
    e.stopPropagation()

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <SectionTitle variant="h3" component="h2">
            Informes
        </SectionTitle>

        {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        )}

        {loading ? (
            <Grid container spacing={3}>
                {[...Array(8)].map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                        <Card>
                            <Skeleton variant="rectangular" height={200} />
                            <CardContent>
                                <Skeleton variant="text" height={32} />
                                <Skeleton variant="text" height={20} />
                                <Skeleton variant="text" height={16} />
                            </CardContent>
                            <CardActions>
                                <Skeleton variant="rectangular" width={80} height={32} />
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        ) : reports.length > 0 ? (
            <Grid container spacing={3}>
                {reports.map((report) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={report._id}>
                        <ReportCard onClick={() => handleReportClick(report._id)}>
                            <Box sx={{ position: 'relative' }}>
                                <DocumentBadge>
                                    DOCUMENTO
                                </DocumentBadge>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={report.coverImage}
                                    alt={report.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Box>

                            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    gutterBottom
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        lineHeight: 1.3,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {report.title}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: .5, mb: 1 }}>
                                    <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDateForDisplay(report.date)}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: .5, mb: 1 }}>
                                    <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {report.authors.map(author => author.name).join(', ')}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        minHeight: '2.4rem'
                                    }}
                                >
                                    {report.introduction}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                <Button
                                    size="small"
                                    startIcon={<ViewIcon />}
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleReportClick(report._id)
                                    }}
                                >
                                    Ver
                                </Button>

                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(e) => handleDownload(e, report)}
                                    sx={{
                                        backgroundColor: 'action.hover',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText'
                                        }
                                    }}
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </CardActions>
                        </ReportCard>
                    </Grid>
                ))}
            </Grid>
        ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay informes disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Proximamente se publicarán nuevos informes.
                </Typography>
            </Box>
        )}
    </Container>
  )
}