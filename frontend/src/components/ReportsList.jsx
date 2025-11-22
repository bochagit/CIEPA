import * as React from 'react';
import { Box, Button, IconButton, Stack, Tooltip, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, Pagination, alpha } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import { brand } from '../../shared-theme/themePrimitives'
import { useTheme, useMediaQuery } from '@mui/material'
import { reportService } from '../services/reportService';

export default function ReportsList() {
    const navigate = useNavigate();
    const dialogs = useDialogs();
    const notifications = useNotifications();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const [reports, setReports] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [selected, setSelected] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);

    const itemsPerPage = isMobile ? 5 : 10;

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

    const fetchReports = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await reportService.getAllReports();

            if (response.success) {
                setReports(response.reports);
            } else {
                setError('Error al cargar informes');
            }
        } catch(err) {
            setError(err.message || 'Error al cargar los informes');
            notifications.show('Error al cargar los informes', { severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [notifications])

    React.useEffect(() => {
        fetchReports();
    }, [fetchReports])

    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReports = reports.slice(startIndex, endIndex);

    const handleRowClick = (id, event) => {
        if (event.target.type === 'checkbox' || event.target.closest('[role="checkbox"]')) {
            return;
        }

        if(isMobile) {
            handleView(id);
        }
    };

    const handleRefresh = React.useCallback(async () => {
        await fetchReports();
        setCurrentPage(1);
        notifications.show('Lista de informes actualizada', { severity: 'success' });
    }, [fetchReports, notifications]);

    const handleDelete = React.useCallback(async (id) => {
        const confirmed = await dialogs.confirm(
            '¿Estás seguro de que quieres eliminar este informe?',
            'Esta acción eliminará el informe y sus archivos asociados.'
        );
        
        if (confirmed) {
            try {
                setLoading(true);

                notifications.show('Eliminando informe y archivos...', {
                    severity: 'info',
                    autoHideDuration: 2000
                })

                await reportService.deleteReport(id);
                
                setReports(prev => {
                    const newReports = prev.filter(item => item._id !== id);
                    const newTotalPages = Math.ceil(newReports.length / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages)
                    }
                    return newReports;
                });

                setSelected(prev => prev.filter(selectedId => selectedId !== id));
                notifications.show('Informe eliminado correctamente', { severity: 'success' });
            } catch(err) {
                notifications.show('Error al eliminar el informe', { severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
    }, [dialogs, notifications, currentPage, itemsPerPage]);

    const handleDeleteSelected = React.useCallback(async () => {
        if (selected.length === 0) return

        const confirmed = await dialogs.confirm(
            `¿Estás seguro de que quieres eliminar ${selected.length} ${selected.length === 1 ? 'informe' : 'informes'}?`,
            'Esta acción eliminará los informes y sus archivos asociados.'
        )

        if (confirmed){
            try {
                setLoading(true)

                notifications.show(`Eliminando ${selected.length} ${selected.length === 1 ? 'informe...' : 'informes...'}`, {
                    severity: 'info',
                    autoHideDuration: 3000
                })

                const deletePromises = selected.map(id => reportService.deleteReport(id))
                const results = await Promise.allSettled(deletePromises)

                const successful = results.filter(result => result.status === 'fulfilled').length
                const failed = results.filter(result => result.status === 'rejected').length

                setReports(prev => {
                    const successfulIds = selected.filter((_, index) => results[index].status === 'fulfilled')
                    const newReports = prev.filter(item => !successfulIds.includes(item._id))

                    const newTotalPages = Math.ceil(newReports.length / itemsPerPage)
                    if (currentPage > newTotalPages && newTotalPages > 0){
                        setCurrentPage(newTotalPages)
                    }

                    return newReports
                })

                setSelected([])

                if (failed === 0){
                    notifications.show(`${successful} informes eliminados correctamente`, { severity: 'success' })
                } else if (successful === 0){
                    notifications.show('Error al eliminar los informes', { severity: 'error' })
                } else {
                    notifications.show(`${successful} eliminados correctamente, ${failed} con errores`, { severity: 'warning' })
                }
            } catch(err) {
                console.error('Error en eliminación masiva: ', err)
                notifications.show('Error al eliminar los informes', { severity: 'error' })
            } finally {
                setLoading(false)
            }
        }
    }, [selected, dialogs, notifications, currentPage, itemsPerPage])

    const handleCreate = () => navigate('/dashboard/informes/new');
    const handleEdit = (id) => navigate(`/dashboard/informes/edit/${id}`);
    const handleView = (id) => navigate(`/dashboard/informes/${id}`);

    const handleDownload = async (report) => {
    try {
        const response = await fetch(report.pdfFile.url)
        
        if (!response.ok) {
            throw new Error('Error al obtener el archivo')
        }
        
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = report.pdfFile.originalName || `${report.title}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        window.URL.revokeObjectURL(blobUrl)

        try {
            await reportService.incrementDownloads(report._id)
            notifications.show('Descarga completada', { severity: 'success' })
        } catch (error) {
            console.warn('Error incrementando descargas:', error)
            notifications.show('Error al incrementar descargas', { severity: 'error' })
        }
        
    } catch (error) {
        console.error('Error descargando archivo:', error)
        notifications.show('Error al descargar archivo', { severity: 'error' })
    }
    }

    const handleSelectAll = (event) => {
        if(event.target.checked) {
            setSelected(prev => [...new Set([...prev, ...currentReports.map(n => n._id)])])
        } else {
            setSelected(prev => prev.filter(id => !currentReports.some(n => n._id === id)))
        }
    }

    const handleSelectOne = (id) => {
        setSelected(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    }

    const currentPageSelected = currentReports.every(item => selected.includes(item._id));
    const currentPageIndeterminate = currentReports.some(item => selected.includes(item._id)) && !currentPageSelected;

    return (
        <PageContainer title="Gestión de Informes">
            <Stack spacing={2}>
                {error && (
                    <Box sx={{ p:2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                        <Typography variant="body2">{error}</Typography>
                    </Box>
                )}

                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        disabled={loading}
                    >
                        Nuevo Informe
                    </Button>

                    {selected.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteSelected}
                            disabled={loading}
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                minWidth: 'auto'
                            }}
                        >
                            Eliminar ({selected.length})
                        </Button>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: {xs: 'none', sm: 'block'} }}>
                            Mostrando {startIndex + 1} - {Math.min(endIndex, reports.length)} de {reports.length}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                            {startIndex + 1}-{Math.min(endIndex, reports.length)} de {reports.length}
                        </Typography>
                    
                        <Tooltip title="Actualizar lista">
                            <IconButton onClick={handleRefresh} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Stack>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography>Cargando informes...</Typography>
                    </Box>
                ) : (
                    <TableContainer 
                        component={Paper} 
                        sx={{ 
                            maxHeight: { xs:'none', md: 600 },
                            overflow: { xs: 'visible', md: 'auto' },

                            '&::-webkit-scrollbar': {
                                width: '4px',
                                height: '2px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'transparent',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: brand.main,
                                borderRadius: '4px',
                                '&:hover': {
                                    backgroundColor: brand.variant,
                                },
                                '&:active': {
                                    backgroundColor: alpha(brand.variant, 0.6)
                                }
                            },
                        }}
                    >
                        <Table stickyHeader={!isMobile} sx={{ minWidth: { xs: 'auto', md: 650 } }}>
                            <TableHead sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #444', color: '#666', fontSize: { xs: '.75rem', md: '.875rem' } } }}>
                                <TableRow>
                                    <TableCell padding="checkbox" sx={{ width: { xs: '40px', md: '60px' } }}>
                                        <Checkbox 
                                            indeterminate={currentPageIndeterminate} 
                                            checked={currentReports.length > 0 && currentPageSelected} 
                                            onChange={handleSelectAll} 
                                            size={isMobile ? 'small' : 'medium'}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ minWidth: {xs: 120, md: 200} }}>Título</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Autores</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Fecha</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Descargas</TableCell>
                                    <TableCell align="center" sx={{ display: { xs: 'none', md:'table-cell' } }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentReports.map((row) => (
                                    <TableRow 
                                        key={row._id} 
                                        hover 
                                        selected={selected.includes(row._id)} 
                                        onClick={(event) => handleRowClick(row._id, event)} 
                                        sx={{ cursor: {xs: 'pointer', md: 'default'}, '&:hover': {backgroundColor: {xs: alpha(theme.palette.primary.main, 0.08), md: 'inherit'}} }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox 
                                                checked={selected.includes(row._id)} 
                                                onChange={() => handleSelectOne(row._id)} 
                                                size={isMobile ? 'small' : 'medium'} 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PictureAsPdfIcon sx={{ color: 'error.main', fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ 
                                                        maxWidth: {xs: 150, md: 300}, 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis', 
                                                        whiteSpace: 'nowrap', 
                                                        fontWeight: 500 
                                                    }}>
                                                        {row.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                                                        {row.authors.map(author => author.name).join(', ')} • {formatDateForDisplay(row.date)}
                                                        <Typography component="span" variant="caption" color="primary.main" sx={{ ml: 1, fontWeight: 600 }}>
                                                            Toca para ver
                                                        </Typography>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                            <Typography variant="body2" noWrap>
                                                {row.authors.map(author => author.name).join(', ')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                            <Typography variant="body2" noWrap>
                                                {formatDateForDisplay(row.date)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                            <Typography variant="body2">
                                                {row.downloads || 0}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                            <Stack direction="row" spacing={0.5} justifyContent="center">
                                                <IconButton size="small" onClick={() => handleView(row._id)}>
                                                    <VisibilityIcon fontSize="small" />                 
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleEdit(row._id)}>
                                                    <EditIcon fontSize="small" />                       
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    color="primary" 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDownload(row)
                                                    }}
                                                >
                                                    <DownloadIcon fontSize="small"/>
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(row._id)}>
                                                    <DeleteIcon fontSize="small"/>
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {selected.length > 0 && (
                    <Box sx={{ p: 2, bgcolor: 'action.selected', borderRadius: 1, mb: { xs: 2, md: 0 } }}>
                        <Typography variant="body2">
                            {selected.length} {(selected.length === 1) ? 'seleccionado' : 'seleccionados'}
                        </Typography>

                        <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1, my: 2 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteSelected}
                                disabled={loading}
                            >
                                Eliminar
                            </Button>
                        </Box>
                    </Box>
                )}

                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pb: { xs: 2, md: 0 } }}>
                        <Pagination 
                            count={totalPages} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                            showFirstButton={!isMobile} 
                            showLastButton={!isMobile} 
                            size={isMobile ? 'small' : 'medium'} 
                        />
                    </Box>
                )}
            </Stack>
        </PageContainer>
    );
}