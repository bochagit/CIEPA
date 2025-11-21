import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import { reportService } from '../services/reportService';

export default function ReportShow() {
    const navigate = useNavigate();
    const { reportId } = useParams();
    const notifications = useNotifications();
    
    const [reportData, setReportData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

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
        const loadReport = async () => {
            try {
                const report = await reportService.getReportById(reportId)
                setReportData(report);
            } catch (error) {
                console.error('Error al cargar el informe:', error);
                notifications.show('Error al cargar el informe', { severity: 'error' });
                navigate('/dashboard/informes');
            } finally {
                setLoading(false);
            }
        };

        if (reportId) {
            loadReport();
        }
    }, [reportId, navigate, notifications]);

    const handleBack = () => {
        navigate('/dashboard/informes');
    };

    const handleEdit = () => {
        navigate(`/dashboard/informes/editar/${reportId}`);
    };

    const handleDownload = async () => {
        if (!reportData) return

        try {
            await reportService.incrementDownloads(reportData._id)
            
            const link = document.createElement('a')
            link.href = reportData.pdfFile.url
            link.download = reportData.pdfFile.originalName || `${reportData.title}.pdf`
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            notifications.show('Descarga iniciada', { severity: 'success' })
        } catch(error) {
            console.error('Error descargando archivo:', error)
            notifications.show('Error al descargar archivo', { severity: 'error' })
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'published': return 'Publicado';
            case 'draft': return 'Borrador';
            default: return status;
        }
    };

    if (loading) {
        return (
            <PageContainer title="Cargando...">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Typography>Cargando informe...</Typography>
                </Box>
            </PageContainer>
        );
    }

    if (!reportData) {
        return (
            <PageContainer title="Informe no encontrado">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Typography>El informe no fue encontrado.</Typography>
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Ver Informe">
            <Stack spacing={3}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Volver a la lista
                    </Button>
                    
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            color="primary"
                        >
                            Descargar PDF
                        </Button>
                        
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                        >
                            Editar
                        </Button>
                    </Stack>
                </Stack>

                <Card>
                    {reportData.coverImage && (
                        <CardMedia
                            component="img"
                            height="300"
                            image={reportData.coverImage}
                            alt={reportData.title}
                            sx={{ objectFit: 'cover' }}
                        />
                    )}
                    
                    <CardContent>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    {reportData.title}
                                </Typography>
                                
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                    <Chip 
                                        label={getStatusLabel(reportData.status)} 
                                        size="small" 
                                        color={getStatusColor(reportData.status)} 
                                    />
                                    <Chip 
                                        icon={<PictureAsPdfIcon />}
                                        label="Documento PDF" 
                                        size="small" 
                                        color="error" 
                                        variant="outlined"
                                    />
                                </Stack>
                            </Box>

                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Fecha: {formatDateForDisplay(reportData.date)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {reportData.authors.length > 1 ? 'Autores:' : 'Autor:'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ ml: 3 }}>
                                        {reportData.authors.map((author, index) => (
                                            <Chip
                                                key={index}
                                                label={author.name}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        ))}
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DownloadIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Descargas: {reportData.downloads || 0}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Resumen
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        lineHeight: 1.7,
                                        textAlign: 'justify'
                                    }}
                                >
                                    {reportData.introduction}
                                </Typography>
                            </Box>

                            <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <PictureAsPdfIcon sx={{ fontSize: 40, color: 'error.main' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {reportData.pdfFile.originalName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {(reportData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        onClick={handleDownload}
                                    >
                                        Descargar
                                    </Button>
                                </Stack>
                            </Paper>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </PageContainer>
    );
}