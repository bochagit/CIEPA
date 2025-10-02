import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { newsData } from '../data/news';
import PageContainer from './PageContainer';

export default function NewsList() {
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [news, setNews] = React.useState(newsData);
  const [loading, setLoading] = React.useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // En una app real, aquí se haría una llamada a la API
    setTimeout(() => {
      setNews(newsData);
      setLoading(false);
      notifications.show('Lista de noticias actualizada', { severity: 'success' });
    }, 500);
  };

  const handleDelete = async (id) => {
    const confirmed = await dialogs.confirm(
      '¿Estás seguro de que quieres eliminar esta noticia?',
      'Esta acción no se puede deshacer.'
    );
    
    if (confirmed) {
      setNews(prev => prev.filter(item => item.id !== id));
      notifications.show('Noticia eliminada correctamente', { severity: 'success' });
    }
  };

  const handleCreate = () => {
    navigate('/dashboard/news/new');
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/news/${id}/edit`);
  };

  const handleView = (id) => {
    navigate(`/dashboard/news/${id}`);
  };

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

  const columns = [
    {
      field: 'title',
      headerName: 'Título',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ 
          whiteSpace: 'normal', 
          wordWrap: 'break-word',
          lineHeight: '1.2',
          py: 1 
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'author',
      headerName: 'Autor',
      width: 150,
    },
    {
      field: 'category',
      headerName: 'Categoría',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" />
      ),
    },
    {
      field: 'publishDate',
      headerName: 'Fecha de publicación',
      width: 150,
      type: 'date',
      valueGetter: (params) => new Date(params),
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={getStatusLabel(params.value)} 
          color={getStatusColor(params.value)}
          size="small" 
        />
      ),
    },
    {
      field: 'featured',
      headerName: 'Destacada',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Sí' : 'No'} 
          color={params.value ? 'primary' : 'default'}
          size="small" 
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      flex: 1,
      minWidth: 120,
      resizable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      cellClassName: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Ver"
          onClick={() => handleView(params.id)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete(params.id)}
          showInMenu
        />,
      ],
    },
  ];

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
          
          <Tooltip title="Actualizar lista">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={news}
            columns={columns}
            loading={loading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              [`& .${gridClasses.cell}`]: {
                py: 1,
              },
              '& .actions': {
                color: 'text.secondary',
              },
              '& .actions:hover': {
                color: 'text.primary',
              },
              // Ensure action buttons are properly centered
              '& .MuiDataGrid-actionsCell': {
                gap: 1,
                justifyContent: 'center',
              },
              // Better visual hierarchy for the grid
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.50',
                borderBottom: 2,
                borderColor: 'grey.200',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Box>
      </Stack>
    </PageContainer>
  );
}