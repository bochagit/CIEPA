import * as React from 'react'
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Skeleton,
    Alert,
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

export default function Informes(){
    const navigate = useNavigate()
    const [reports, setReports] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return ''

        try {
            if (typeof dateString === 'string' && dateString.includes('T')){
                const dateOnly = dateString.split('T')[0]
                const [year, month, day] = dateOnly.split('-')
                const formatted = `${day}/${month}/${year}`
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
                        <Box 
                            onClick={() => handleReportClick(report._id)}
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: { xs: 280, md: 320 },
                                overflow: 'hidden',
                                boxShadow: 3,
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${report.coverImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }} />

                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            }} />

                            <Box sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                zIndex: 2
                            }}>
                                DOCUMENTO
                            </Box>

                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                p: { xs: 2, md: 3 },
                                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                                color: 'white'
                            }}>
                                <Typography 
                                    variant="h6" 
                                    component="h3" 
                                    gutterBottom 
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1.5,
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        lineHeight: 1.3,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {report.title}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                    <CalendarIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                                    <Typography variant="caption" sx={{ 
                                        opacity: 0.9,
                                        fontSize: '0.75rem'
                                    }}>
                                        {formatDateForDisplay(report.date)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                    <PersonIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            opacity: 0.9,
                                            fontSize: '0.75rem',
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
                                    sx={{
                                        opacity: 0.8,
                                        fontSize: '0.8rem',
                                        lineHeight: 1.4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mb: 1
                                    }}
                                >
                                    {report.introduction}
                                </Typography>
                            </Box>
                        </Box>
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