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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { getNewsById } from '../data/news';
import PageContainer from './PageContainer';

export default function NewsShow() {
  const navigate = useNavigate();
  const { newsId } = useParams();
  const notifications = useNotifications();
  
  const [newsData, setNewsData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadNews = async () => {
      try {
        // En una app real, aquí se haría una llamada a la API
        const news = getNewsById(newsId);
        if (news) {
          setNewsData(news);
        } else {
          notifications.show('Noticia no encontrada', { severity: 'error' });
          navigate('/dashboard/news');
        }
      } catch (error) {
        console.error('Error al cargar la noticia:', error);
        notifications.show('Error al cargar la noticia', { severity: 'error' });
        navigate('/dashboard/news');
      } finally {
        setLoading(false);
      }
    };

    if (newsId) {
      loadNews();
    }
  }, [newsId, navigate, notifications]);

  const handleBack = () => {
    navigate('/dashboard/news');
  };

  const handleEdit = () => {
    navigate(`/dashboard/news/${newsId}/edit`);
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

  if (loading) {
    return (
      <PageContainer title="Cargando...">
        <div>Cargando noticia...</div>
      </PageContainer>
    );
  }

  if (!newsData) {
    return (
      <PageContainer title="Noticia no encontrada">
        <div>La noticia no fue encontrada.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Ver Noticia">
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Volver a la lista
          </Button>
          
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Editar
          </Button>
        </Stack>

        <Card>
          {newsData.imageUrl && (
            <CardMedia
              component="img"
              height="300"
              image={newsData.imageUrl}
              alt={newsData.title}
              sx={{ objectFit: 'cover' }}
            />
          )}
          
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {newsData.title}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip 
                    label={newsData.category} 
                    size="small" 
                    color="primary" 
                  />
                  <Chip 
                    label={getStatusLabel(newsData.status)} 
                    size="small" 
                    color={getStatusColor(newsData.status)} 
                  />
                  {newsData.featured && (
                    <Chip 
                      label="Destacada" 
                      size="small" 
                      color="secondary" 
                    />
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Por: {newsData.author} • {new Date(newsData.publishDate).toLocaleDateString('es-ES')}
                </Typography>
              </Box>

              {newsData.excerpt && (
                <Box sx={{ bgcolor: 'transparent', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary" fontStyle="italic">
                    {newsData.excerpt}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="h6" gutterBottom>
                  Contenido
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {newsData.content}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </PageContainer>
  );
}