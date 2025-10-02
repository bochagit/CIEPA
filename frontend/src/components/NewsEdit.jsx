import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NewsForm from './NewsForm';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { getNewsById, updateNews } from '../data/news';
import PageContainer from './PageContainer';

export default function NewsEdit() {
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

  const handleSubmit = async (formData) => {
    try {
      // En una app real, aquí se haría una llamada a la API
      const updatedNews = updateNews(newsId, formData);
      console.log('Noticia actualizada:', updatedNews);
      
      notifications.show('Noticia actualizada correctamente', { severity: 'success' });
      navigate('/dashboard/news');
    } catch (error) {
      console.error('Error al actualizar la noticia:', error);
      notifications.show('Error al actualizar la noticia', { severity: 'error' });
    }
  };

  const handleClose = () => {
    navigate('/dashboard/news');
  };

  if (loading) {
    return (
      <PageContainer title="Cargando...">
        <div>Cargando noticia...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Editar Noticia">
      <NewsForm
        open={true}
        title="Editar Noticia"
        initialValue={newsData}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </PageContainer>
  );
}