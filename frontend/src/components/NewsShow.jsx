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
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import { postService } from '../services/postService';

export default function NewsShow() {
  const navigate = useNavigate();
  const { newsId } = useParams();
  const notifications = useNotifications();
  
  const [newsData, setNewsData] = React.useState(null);
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
    const loadNews = async () => {
      try {
        const post = await postService.getPostById(newsId)
        if (post) {
          const adaptedNews = {
            id: post._id,
            title: post.title,
            content: post.content,
            authors: post.authors || [],
            date: post.date,
            category: post.category || 'General',
            status: post.status || 'draft',
            featured: post.featured || false,
            imageUrl: post.coverImage,
            excerpt: post.summary
          }
          setNewsData(adaptedNews);
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
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Cargando noticia...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!newsData) {
    return (
      <PageContainer title="Noticia no encontrada">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>La noticia no fue encontrada.</Typography>
        </Box>
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {newsData.authors.length > 1 ? (
                  <>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.875rem' } }}>
                      {newsData.authors.map((author, index) => (
                        <Avatar key={index} sx={{ bgcolor: 'primary.main' }}>
                          {author.name.charAt(0).toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Autores
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {newsData.authors.map(a => a.name).join(', ')}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      {newsData.authors[0]?.name?.charAt(0).toUpperCase() || 'A'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Autor
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {newsData.authors[0]?.name || 'Sin autor'}
                      </Typography>
                    </Box>
                  </>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                  {formatDateForDisplay(newsData.date)}
                </Typography>
              </Box>

              {newsData.excerpt && (
                <Box sx={{ bgcolor: 'transparent', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary" fontStyle="italic" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {newsData.excerpt}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="h6" gutterBottom>
                  Contenido
                </Typography>
                <Box
                  className="ql-editor"
                  sx={{
                    border: 'none !important',
                    padding: '0 !important',
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    '& p': { margin: '0 0 1em 0' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      fontWeight: 'normal',
                      margin: '1em 0 0.5em 0'
                    },
                    '& ul, & ol': {paddingLeft: '1.5em'},
                    '& blockquote': {
                      borderLeft: '4px solid #ccc',
                      margin: '1em 0',
                      paddingLeft: '1em',
                      fontStyle: 'italic'
                    },
                    '& img': {maxWidth: '100%', height: 'auto'},
                    '& a': {
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {textDecoration: 'underline'}
                    }
                  }}
                  dangerouslySetInnerHTML={{__html: newsData.content}} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </PageContainer>
  );
}