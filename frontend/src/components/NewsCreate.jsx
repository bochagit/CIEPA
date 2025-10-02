import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import NewsForm from './NewsForm';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { createNews } from '../data/news';
import PageContainer from './PageContainer';

export default function NewsCreate() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const handleSubmit = async (formData) => {
    try {
      // En una app real, aquí se haría una llamada a la API
      const newNews = createNews(formData);
      console.log('Nueva noticia creada:', newNews);
      
      notifications.show('Noticia creada correctamente', { severity: 'success' });
      navigate('/dashboard/news');
    } catch (error) {
      console.error('Error al crear la noticia:', error);
      notifications.show('Error al crear la noticia', { severity: 'error' });
    }
  };

  const handleClose = () => {
    navigate('/dashboard/news');
  };

  return (
    <PageContainer title="Crear Nueva Noticia">
      <NewsForm
        open={true}
        title="Crear Nueva Noticia"
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </PageContainer>
  );
}