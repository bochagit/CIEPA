import * as React from 'react';
import { Box, Button, IconButton, Stack, Tooltip, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, Pagination, alpha, FormControl, OutlinedInput, InputAdornment } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import { brand } from '../../shared-theme/themePrimitives'
import { useTheme, useMediaQuery } from '@mui/material'
import { postService } from '../services/postService';
import { SearchRounded as SearchRoundedIcon } from '@mui/icons-material';

export function Search({ onSearch, searchTerm }) {
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm || '')

  const handleInputChange = (event) => {
    setLocalSearchTerm(event.target.value)
  }

  const executeSearch = () => {
    onSearch(localSearchTerm.trim())
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      executeSearch()
    }
  }

  React.useEffect(() => {
    setLocalSearchTerm(searchTerm || '')
  }, [searchTerm])

  return (
    <FormControl sx={{ width: '25ch' }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Buscar..."
        value={localSearchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <IconButton
              onClick={executeSearch}
              edge="start"
              size="small"
              sx={{ backgroundColor: 'transparent !important', border: 'none', '&:hover': { color: 'primary.main', backgroundColor: 'transparent' } }}
            >
              <SearchRoundedIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

export default function NewsList() {
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selected, setSelected] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('')

  const itemsPerPage = isMobile ? 5 : 10;

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

  const adaptPostToNews = (post) => ({
    id: post._id,
    title: post.title,
    author: post.author,
    category: post.category || 'General',
    date: post.date,
    status: post.status || 'published',
    featured: post.featured || false,
    summary: post.summary,
    content: post.content
  })

  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getAllPosts();

      const posts = response.posts || []

      const adaptedPosts = posts.map(adaptPostToNews);
      setNews(adaptedPosts);
    } catch(err) {
      setError(err.message || 'Error al cargar las notas');
      notifications.show('Error al cargar las notas', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [notifications])

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts])

  const filteredNews = React.useMemo(() => {
    if (!searchTerm.trim()){
      return news
    }

    const searchLower = searchTerm.toLowerCase()
    return news.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.author.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      (item.summary && item.summary.toLowerCase().includes(searchLower))
    )
  }, [news, searchTerm])

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const handleRowClick = (id, event) => {
    if (event.target.type === 'checkbox' || event.target.closest('[role="checkbox"]')) {
      return;
    }

    if(isMobile) {
      handleView(id);
    }
  };

  const handleRefresh = React.useCallback(async () => {
    await fetchPosts();
    setCurrentPage(1);
    notifications.show('Lista de noticias actualizada', { severity: 'success' });
  }, [fetchPosts, notifications]);

  const handleDelete = React.useCallback(async (id) => {
    const confirmed = await dialogs.confirm(
      '¿Estás seguro de que quieres eliminar esta noticia?',
      'Esta acción no se puede deshacer.'
    );
    
    if (confirmed) {
      try {
        setLoading(true);

        notifications.show('Eliminando noticia e imágenes...', {
          severity: 'info',
          autoHideDuration: 2000
        })

        await postService.deletePost(id);
        setNews(prev => {
          const newNews = prev.filter(item => item.id !== id);
          const newTotalPages = Math.ceil(newNews.length / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages)
          }
          return newNews;
      });

      setSelected(prev => prev.filter(selectedId => selectedId !== id));
      notifications.show('Nota eliminada correctamente', { severity: 'success' });
    } catch(err) {
      notifications.show('Error al eliminar la nota', { severity: 'error' });
    } finally {
      setLoading(false);
    }
    }
  }, [dialogs, notifications, currentPage, itemsPerPage]);

  const handleDeleteSelected = React.useCallback(async () => {
    if (selected.length === 0) return

    const confirmed = await dialogs.confirm(
      `¿Estás seguro de que queres eliminar ${selected.length} ${selected.length === 1 ? 'noticia' : 'noticias'}?`,
      'Esta acción no se puede deshacer.'
    )

    if (confirmed){
      try {
        setLoading(true)

        notifications.show(`Eliminando ${selected.length} ${selected.length === 1 ? 'noticia...' : 'noticias...'}`, {
          severity: 'info',
          autoHideDuration: 3000
        })

        const deletePromises = selected.map(id => postService.deletePost(id))
        const results = await Promise.allSettled(deletePromises)

        const successful = results.filter(result => result.status === 'fulfilled').length
        const failed = results.filter(result => result.status === 'rejected').length

        setNews(prev => {
          const successfulIds = selected.filter((_, index) => results[index].status === 'fulfilled')
          const newNews = prev.filter(item => !successfulIds.includes(item.id))

          const newTotalPages = Math.ceil(newNews.length / itemsPerPage)
          if (currentPage > newTotalPages && newTotalPages > 0){
            setCurrentPage(newTotalPages)
          }

          return newNews
        })

        setSelected([])

        if (failed === 0){
          notifications.show(`${successful} noticias eliminadas correctamente`, { severity: 'success' })
        } else if (successful === 0){
          notifications.show('Error al eliminar las noticias', { severity: 'error' })
        } else {
          notifications.show(`${successful} eliminadas correctamente, ${failed} con errores`, { severity: 'warning' })
        }
      } catch(err) {
      console.error('Error en eliminación masiva: ', err)
      notifications.show('Error al eliminar las noticias', { severity: 'error' })
      } finally {
        setLoading(false)
      }
    }
  }, [selected, dialogs, notifications, currentPage, itemsPerPage])

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

  const handleSearch = (search) => {
    setSearchTerm(search)
    setCurrentPage(1)
  }

  const currentPageSelected = currentNews.every(item => selected.includes(item.id));
  const currentPageIndeterminate = currentNews.some(item => selected.includes(item.id)) && !currentPageSelected;

  return (
    <PageContainer title="Gestión de Noticias">
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
            Nueva Noticia
          </Button>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              width: 'fit-content',
              overflow: 'auto',
            }}
          >
            <Search onSearch={handleSearch} searchTerm={searchTerm} />
          </Box>

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
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredNews.length)} de {filteredNews.length}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
              {startIndex + 1}-{Math.min(endIndex, filteredNews.length)} de {filteredNews.length}
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
            <Typography>Cargando notas...</Typography>
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
                        {row.author} • {formatDateForDisplay(row.date)}
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
                      {formatDateForDisplay(row.date)}
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
        )}
        {
          selected.length > 0 && (
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
          )
        }
        {
          totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pb: { xs: 2, md: 0 } }}>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" showFirstButton={!isMobile} showLastButton={!isMobile} size={isMobile ? 'small' : 'medium'} />
            </Box>
          )
        }
      </Stack>
    </PageContainer>
  );
}