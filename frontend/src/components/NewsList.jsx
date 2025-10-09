import * as React from 'react';
import { Box, Button, IconButton, Stack, Tooltip, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, Pagination, alpha } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { newsData } from '../data/news';
import PageContainer from './PageContainer';
import { brand } from '../../shared-theme/themePrimitives'
import { useTheme, useMediaQuery } from '@mui/material'

export default function NewsList() {
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [news, setNews] = React.useState(newsData);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const itemsPerPage = isMobile ? 5 : 10;

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  const handleRowClick = (id, event) => {
    if (event.target.type === 'checkbox' || event.target.closest('[role="checkbox"]')) {
      return;
    }

    if(isMobile) {
      handleView(id);
    }
  };

  const handleRefresh = React.useCallback(async () => {
    setLoading(true);
    // En una app real, aquí se haría una llamada a la API
    setTimeout(() => {
      setNews(newsData);
      setLoading(false);
      setCurrentPage(1);
      notifications.show('Lista de noticias actualizada', { severity: 'success' });
    }, 500);
  }, [notifications]);

  const handleDelete = React.useCallback(async (id) => {
    const confirmed = await dialogs.confirm(
      '¿Estás seguro de que quieres eliminar esta noticia?',
      'Esta acción no se puede deshacer.'
    );
    
    if (confirmed) {
      setNews(prev => {
        const newNews = prev.filter(item => item.id !== id);
        const newTotalPages = Math.ceil(newNews.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
        return newNews;
      });
      setSelected(prev => prev.filter(selectedId => selectedId !== id));
      notifications.show('Noticia eliminada correctamente', { severity: 'success' });
    }
  }, [dialogs, notifications, currentPage, itemsPerPage]);

  const handleCreate = () => navigate('/dashboard/news/new');
  const handleEdit = (id) => navigate(`/dashboard/news/${id}/edit`);
  const handleView = (id) => navigate(`/dashboard/news/${id}`);

  const handleSelectAll = (event) => {
    if(event.target.checked) {
      setSelected(prev => [...new Set([...prev, ...currentNews.map(n => n.id)])])
    } else {
      setSelected(prev => prev.filter(id => !currentNews.some(n => n.id === id)))
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Borrador';
      case 'archived': return 'Archivado';
      default: return status;
    }
  };

  const currentPageSelected = currentNews.every(item => selected.includes(item.id));
  const currentPageIndeterminate = currentNews.some(item => selected.includes(item.id)) && !currentPageSelected;

  return (
    <PageContainer title="Gestión de Noticias">
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nueva Noticia
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: {xs: 'none', sm: 'block'} }}>
              Mostrando {startIndex + 1} - {Math.min(endIndex, news.length)} de {news.length}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
              {startIndex + 1}-{Math.min(endIndex, news.length)} de {news.length}
            </Typography>
          
            <Tooltip title="Actualizar lista">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

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
                  <Checkbox indeterminate={currentPageIndeterminate} checked={currentNews.length > 0 && currentPageSelected} onChange={handleSelectAll} size={isMobile ? 'small' : 'medium'}/>
                </TableCell>
                <TableCell sx={{ minWidth: {xs: 120, md: 200} }}>Título</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Autor</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Categoría</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Fecha de publicación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Destacada</TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', md:'table-cell' } }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentNews.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)} onClick={(event) => handleRowClick(row.id, event)} sx={{ cursor: {xs: 'pointer', md: 'default'}, '&:hover': {backgroundColor: {xs: alpha(theme.palette.primary.main, 0.08), md: 'inherit'}} }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} size={isMobile ? 'small' : 'medium'} />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ maxWidth: {xs: 150, md: 300}, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {row.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                        {row.author} • {new Date(row.publishDate).toLocaleDateString()}
                        <Typography component="span" variant="caption" color="primary.main" sx={{ ml: 1, fontWeight: 600 }}>Toca para ver</Typography>
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography variant="body2" noWrap>
                      {row.author}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip label={row.category} size="small" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography variant="body2" noWrap>
                      {new Date(row.publishDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Chip label={row.featured ? 'Sí' : 'No' } color={row.featured ? 'primary' : 'default'} size="small" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton size="small" onClick={() => handleView(row.id)}>
                        <VisibilityIcon fontSize="small" />                 
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(row.id)}>
                        <EditIcon fontSize="small" />                       
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {
          totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pb: { xs: 2, md: 0 } }}>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" showFirstButton={!isMobile} showLastButton={!isMobile} size={isMobile ? 'small' : 'medium'} />
            </Box>
          )
        }

        {
          selected.length > 0 && (
            <Box sx={{ p: 2, bgcolor: 'action.selected', borderRadius: 1, mb: { xs: 2, md: 0 } }}>
              <Typography variant="body2">
                {selected.length} {(selected.length === 1) ? 'seleccionado' : 'seleccionados'}
              </Typography>
            </Box>
          )
        }
      </Stack>
    </PageContainer>
  );
}