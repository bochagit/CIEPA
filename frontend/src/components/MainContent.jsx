import * as React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Button,
  Container,
  Divider,
  Avatar,
  Skeleton,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { brand } from '../../shared-theme/themePrimitives';
import { secondary } from '../../shared-theme/themePrimitives';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { eventService } from '../services/eventService';
import { reportService } from '../services/reportService';
import heroImage from '../assets/images/static-photos/1.jpg'
import { Email as EmailIcon } from '@mui/icons-material';
const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  marginTop: 10,
  flexDirection: 'column',
  padding: 20,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    cursor: 'pointer'
  },
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(brand.main, 0.1)}`,
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(brand.main, 0.1)} 0%, ${alpha(brand.main, 0.05)} 100%)`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(6, 4),
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

export default function MainContent() {
  const [publicaciones, setPublicaciones] = React.useState([])
  const [loadingPublicaciones, setLoadingPublicaciones] = React.useState(true)
  const [errorPublicaciones, setErrorPublicaciones] = React.useState('')
  const [actividades, setActividades] = React.useState([])
  const [loadingActividades, setLoadingActividades] = React.useState(true)
  const [errorActividades, setErrorActividades] = React.useState('')
  const [currentPublicacion, setCurrentPublicacion] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [currentActividad, setCurrentActividad] = React.useState(0)
  const [isTransitioningActividad, setIsTransitioningActividad] = React.useState(false)

  const navigate = useNavigate()

  const getEventTypeLabel = (type) => {
    const typeLabels = {
      'conversatorio': 'Conversatorio',
      'formacion': 'Ciclo de formaciones',
      'jornada': 'Jornadas'
    }
    return typeLabels[type] || type
  }

  const getEventTypeColor = (type) => {
    const typeColors = {
      'conversatorio': 'primary',
      'formacion': 'secondary',
      'jornada': 'success'
    }
    return typeColors[type] || 'default'
  }

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
    const fetchPublicaciones = async () => {
      try {
        setLoadingPublicaciones(true)
        setErrorPublicaciones('')

        const postsResponse = await postService.getAllPosts({
          limit: 10,
          status: 'published',
          featured: true
        })

        const reportsResponse = await reportService.getAllReports({
          limit: 10
        })

        console.log('Posts obtenidos: ', postsResponse)
        console.log('Informes obtenidos: ', reportsResponse)

        const allPublicaciones = []

        if (postsResponse.posts && postsResponse.posts.length > 0) {
          postsResponse.posts.forEach(post => {
            allPublicaciones.push({
              id: post._id,
              tipo: 'nota',
              titulo: post.title,
              descripcion: post.summary || post.content.substring(0, 200) + '...',
              imagen: post.coverImage,
              fecha: post.date,
              autores: post.authors || []
            })
          })
        }

        if (reportsResponse.reports && reportsResponse.reports.length > 0) {
          reportsResponse.reports.forEach(report => {
            allPublicaciones.push({
              id: report._id,
              tipo: 'informe',
              titulo: report.title,
              descripcion: report.introduction || 'Informe disponible para descarga',
              imagen: report.coverImage,
              fecha: report.date,
              autores: report.authors || []
            })
          })
        }

        const publicacionesOrdenadas = allPublicaciones
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 4)

        setPublicaciones(publicacionesOrdenadas)
      } catch(error) {
        console.error('Error al cargar publicaciones:', error)
        setErrorPublicaciones('Error al cargar publicaciones')
        setPublicaciones([])
      } finally {
        setLoadingPublicaciones(false)
      }
    }

    fetchPublicaciones()
  }, [])

  React.useEffect(() => {
    const fetchActividades = async () => {
      try {
        setLoadingActividades(true)
        setErrorActividades('')

        console.log('Cargando ultimas actividades...')
        const response = await eventService.getAllEvents()

        console.log('Eventos obtenidos: ', response)

        if (response.events && response.events.length > 0){
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const actividadesPasadas = response.events.filter(event => {
            const eventDate = new Date(event.date)
            eventDate.setHours(0, 0, 0, 0)
            return eventDate < today
          })

          const actividadesFormateadas = actividadesPasadas
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4)
            .map(event => ({
              id: event._id,
              titulo: event.title,
              tipo: event.type,
              imagen: event.coverImage,
              fecha: event.date,
              descripcion: getEventTypeLabel(event.type)
            }))

            setActividades(actividadesFormateadas)
        } else {
          console.log('No se encontraron eventos')
          setActividades([])
        }
      } catch(error) {
        console.error('Error al cargar actividades: ', error)
        setErrorActividades('Error al cargar actividades')
        setActividades([])
      } finally {
        setLoadingActividades(false)
      }
    }

    fetchActividades()
  }, [])

  React.useEffect(() => {
    if (actividades.length === 0) return

    const interval = setInterval(() => {
      handleNextActividad()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentActividad, actividades.length])

  const handleNextActividad = () => {
    if (actividades.length <= 1) return

    setIsTransitioningActividad(true)
    setTimeout(() => {
      setCurrentActividad((prev) => (prev + 1) % actividades.length)
      setIsTransitioningActividad(false)
    }, 300)
  }

  const handleActividadClick = (index) => {
    if (index !== currentActividad){
      setIsTransitioningActividad(true)

      setTimeout(() => {
        setCurrentActividad(index)
        setIsTransitioningActividad(false)
      }, 300)
    }
  }

  React.useEffect(() => {
    if (publicaciones.length === 0) return
    
    const interval = setInterval(() => {
      handleNextPublicacion()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentPublicacion, publicaciones.length])

  const handleNextPublicacion = () => {
    if (publicaciones.length <= 1) return

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPublicacion((prev) => (prev + 1) % publicaciones.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePublicacionClick = (index) => {
    if (index !== currentPublicacion){
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentPublicacion(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleVerPublicacion = () => {
    if (publicaciones.length > 0) {
      const currentItem = publicaciones[currentPublicacion]
      if (currentItem.tipo === 'nota') {
        navigate(`/notas/${currentItem.id}`)
      } else {
        navigate(`/informes/${currentItem.id}`)
      }
    }
  }

  const handleVerActividad = () => {
    if(actividades.length > 0){
      const currentEvent = actividades[currentActividad]
      navigate(`/actividades/${currentEvent.id}`)
    }
  }

  return (
    <Container maxWidth="lg" sx={{
        '& .MuiTypography-body1, & .MuiTypography-body2': {
          textAlign: 'justify'
        }
      }}
    >
      <IconButton
        color="inherit"
        size="large"
        href="mailto:ciepa@agro.uba.ar"
        target='_blank'
        rel='noopener noreferrer'
        aria-label="Email"
        sx={{
            position: 'fixed',
            bottom: 40,
            right: 50,
            alignSelf: 'center', 
            borderRadius: '50%', 
            borderColor: secondary.variant,
            transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out, border-radius .2s ease-in-out', 
            backgroundColor: secondary.main,
            zIndex: 1000,
            '&:hover': 
                { 
                    transform: 'translateY(-4px)', 
                    boxShadow: 3,
                    backgroundColor: secondary.variant,
                    borderColor: secondary.main
                }, 
            '&::before':
                {
                    content: { xs: '""', lg: '"Contactate"' }, 
                    position: 'absolute', 
                    fontSize: '.8rem',
                    color: 'text.primary', 
                    top: -22,
                    fontWeight: 500
                },
            '&::after': 
                { 
                    content: { xs: '""', lg: '"ciepa@agro.uba.ar"' }, 
                    position: 'absolute', 
                    fontSize: '.8rem', 
                    color: 'text.primary', 
                    top: 50, 
                    fontWeight: 500 
                }
        }}
    >
        <EmailIcon sx={{ color: '#fff' }} />
    </IconButton>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
        <HeroSection sx={{ width: { xs: '100%', lg: '40%' }, height: { xs: 'auto', lg: 500 }, borderRadius: { xs: '1.5rem', lg: '1.5rem 0 0 1.5rem' } }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Acerca del CIEPA
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
              Somos un Centro de Estudios de la Universidad de Buenos Aires integrado por docentes, investigadores, graduada/os y estudiantes de diversas disciplinas que presentan interés y/o trabajan en políticas ambientales. <br />
              A través del estudio y análisis, buscamos aportar a la formulación y desarrollo de políticas públicas ambientales basadas en el conocimiento científico-técnico, promoviendo espacios de articulación, debate y divulgación que impulsen un desarrollo nacional con perspectiva ambiental y una mejor calidad de vida para las personas.
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => navigate("/quienes-somos")} sx={{ marginTop: "2rem" }}>
              Conocenos
            </Button>
        </HeroSection>
        <Box 
          sx={{ 
            width: { xs: '100%', lg: '60%' }, 
            height: 500, 
            backgroundImage: `url(${heroImage})`, 
            backgroundPosition: 'center', 
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat', 
            borderRadius: { xs: '1.5rem', lg: '0 1.5rem 1.5rem 0' } 
          }}
        />
      </Box>
      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          Nuestro Trabajo
        </SectionTitle>
        <StyledCard onClick={() => navigate('/informes')}>
            <CardContent sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box>
                    <Avatar sx={{ bgcolor: alpha(brand.main, 0.1), color: brand.main, width: 64, height: 64, margin: 'auto' }}>
                        <AnalyticsIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" component="h3" fontWeight={600}>
                        Análisis
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ width: '80%', fontSize: '1rem' }}>
                Estudiamos y producimos conocimiento científico-técnico crítico sobre las políticas ambientales implementadas a nivel local, nacional y regional. Desde un enfoque interdisciplinario realizamos análisis, diagnósticos y prospección de políticas ambientales.
                </Typography>
            </CardContent>
        </StyledCard>
        <StyledCard onClick={() => navigate('/cursos')}>
            <CardContent sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box>
                    <Avatar sx={{ bgcolor: alpha(brand.main, 0.1), color: brand.main, width: 64, height: 64, margin: 'auto' }}>
                        <SchoolIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" component="h3" fontWeight={600}>
                        Formación
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ width: '80%', fontSize: '1rem' }}>
                Trabajamos la formación de profesionales y contribuimos a la democratización del conocimiento ambiental, promoviendo su acceso y difusión. Generamos espacios de intercambio, debate y aprendizaje que fortalecen capacidades y fomentan la construcción colectiva de soluciones frente a los desafíos ambientales.
                </Typography>
            </CardContent>
        </StyledCard>
        <StyledCard onClick={() => navigate('/lineas-trabajo')}>
            <CardContent sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box>
                    <Avatar sx={{ bgcolor: alpha(brand.main, 0.1), color: brand.main, width: 64, height: 64, margin: 'auto' }}>
                        <PublicIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" component="h3" fontWeight={600}>
                        Asesoramiento
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ width: '80%', fontSize: '1rem' }}>
                Estudiamos y asistimos técnicamente a la formulación, planificación e implementación de políticas públicas ambientales. Nuestro acompañamiento busca fortalecer la gestión ambiental, favorecer la toma de decisiones informada y promover políticas más efectivas.
                </Typography>
            </CardContent>
        </StyledCard>
      </SectionContainer>

      <Divider sx={{ my: 6 }} />

      <Box sx={{ 
        display: { xs: 'block', lg: 'flex' }, 
        gap: { lg: 4 },
        alignItems: 'flex-start'
      }}>
        
        <Box sx={{ 
          width: { xs: '100%', lg: '50%' },
          mb: { xs: 6, lg: 0 }
        }}>
          <SectionTitle variant="h3" component="h2" sx={{ 
            fontSize: { xs: '2rem', lg: '1.75rem' }
          }}>
            Publicaciones recientes
          </SectionTitle>

          {errorPublicaciones && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {errorPublicaciones}
            </Alert>
          )}

          {loadingPublicaciones ? (
            <Box sx={{ position: 'relative', height: {xs: 400, lg: 350}, borderRadius: 3, overflow: 'hidden', mb: 4 }}>
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>
          ) : publicaciones.length > 0 ? (
          <Box sx={{ position: 'relative', height: {xs: 400, lg: 350}, borderRadius: 3, overflow: 'hidden', mb: 4, boxShadow: 3 }} >
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${publicaciones[currentPublicacion].imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: isTransitioning ? 0 : 1,
              transition: 'opacity .5s ease-in-out'
            }} />
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, .4)'
            }} />
            <Chip
              label={publicaciones[currentPublicacion].tipo === 'nota' ? 'Nota' : 'Informe'}
              size="small"
              color="primary"
              sx={{
                backgroundColor: publicaciones[currentPublicacion].tipo === 'nota' ? secondary.main : brand.main,
                fontWeight: 600,
                fontSize: { xs: '0.75rem', lg: '0.7rem' },
                position: 'relative',
                top: 10,
                left: 15,
                zIndex: 10000
              }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: { xs: 3, lg: 3 },
              background: 'linear-gradient(transparent, rgba(0, 0, 0, .8))',
              color: 'white',
              opacity: isTransitioning ? 0 : 1,
              transition: 'opacity .5s ease-in-out'
            }}
            >
            <Typography
              variant="h4"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.5rem', lg: '1.25rem' },
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              >
                {publicaciones[currentPublicacion].titulo}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  maxWidth: '800px',
                  fontSize: { xs: '.9rem', lg: '0.85rem' },
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: { xs: 1, md: 2 },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
                >
                  {publicaciones[currentPublicacion].descripcion}
                </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ opacity: .9, fontSize: { xs: '0.875rem', lg: '0.75rem' } }}>
                      Por {publicaciones[currentPublicacion].autores?.map(a => a.name).join(', ') || 'CIEPA'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: .9, fontSize: { xs: '0.875rem', lg: '0.75rem' } }}>
                      {formatDateForDisplay(publicaciones[currentPublicacion].fecha)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleVerPublicacion}
                    size={window.innerWidth >= 1200 ? 'small' : 'medium'}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, .2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, .3)',
                      mt: 2,
                      fontSize: { xs: '0.875rem', lg: '0.75rem' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, .3)'
                      }
                    }}
                  >
                    Leer más
                  </Button>
                </Box>
                <Box sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  display: 'flex',
                  gap: 1
                  }}
                >
                {publicaciones.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => handlePublicacionClick(index)}
                    sx={{
                      width: { xs: 10, lg: 8 },
                      height: { xs: 10, lg: 8 },
                      borderRadius: '50%',
                      backgroundColor: index === currentPublicacion ? 'white' : alpha('#fff', .5),
                      cursor: 'pointer',
                      transition: 'all .3s ease',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'scale(1.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: 'background.paper',
              borderRadius: 3,
              border: `1px solid ${alpha(brand.main, .1)}`
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay publicaciones destacadas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center !important' }}>
                Actualmente no tenemos publicaciones marcadas como destacadas.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => navigate('/notas')}
                sx={{ mt: 1 }}
              >
                Ver todas las notas
              </Button>
            </Box>
          )}
        </Box>

        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ 
            display: { xs: 'none', lg: 'block' },
            mx: 2,
            borderColor: alpha(brand.main, 0.3),
            borderWidth: 1
          }} 
        />

        <Divider sx={{ 
          display: { xs: 'block', lg: 'none' },
          my: 6 
        }} />

        <Box sx={{ 
          width: { xs: '100%', lg: '50%' }
        }}>
          <SectionTitle variant="h3" component="h2" sx={{ 
            fontSize: { xs: '2rem', lg: '1.75rem' }
          }}>
            Actividades recientes
          </SectionTitle>

          {errorActividades && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {errorActividades}
            </Alert>
          )}

          {loadingActividades ? (
            <Box sx={{ position: 'relative', height: {xs: 400, lg: 350}, borderRadius: 3, overflow: 'hidden', mb: 4 }}>
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>
          ) : actividades.length > 0 ? (
            <Box sx={{ position: 'relative', height: {xs: 400, lg: 350}, borderRadius: 3, overflow: 'hidden', mb: 4, boxShadow: 3 }} >
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${actividades[currentActividad].imagen})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: isTransitioningActividad ? 0 : 1,
                transition: 'opacity .5s ease-in-out'
              }} />

              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, .5)'
              }} />

              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 3, lg: 3 },
                background: 'linear-gradient(transparent, rgba(0, 0, 0, .8))',
                color: 'white',
                opacity: isTransitioningActividad ? 0 : 1,
                transition: 'opacity .5s ease-in-out'
              }}>
                <Typography
                  variant="h4"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1.5rem', lg: '1.25rem' }
                  }}
                >
                  {actividades[currentActividad].titulo}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    maxWidth: '800px',
                    fontSize: { xs: '.9rem', lg: '0.85rem' },
                    lineHeight: 1.6,
                    opacity: 0.9
                  }}
                >
                  {actividades[currentActividad].descripcion}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: .9, fontSize: { xs: '0.875rem', lg: '0.75rem' } }}>
                    {formatDateForDisplay(actividades[currentActividad].fecha)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerActividad}
                  size={window.innerWidth >= 1200 ? 'small' : 'medium'}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, .2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, .3)',
                    fontSize: { xs: '0.875rem', lg: '0.75rem' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, .3)'
                    }
                  }}
                >
                  Ver actividad
                </Button>
              </Box>

              <Box sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                display: 'flex',
                gap: 1
              }}>
                {actividades.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => handleActividadClick(index)}
                    sx={{
                      width: { xs: 10, lg: 8 },
                      height: { xs: 10, lg: 8 },
                      borderRadius: '50%',
                      backgroundColor: index === currentActividad ? 'white' : alpha('#fff', .5),
                      cursor: 'pointer',
                      transition: 'all .3s ease',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'scale(1.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: 'background.paper',
              borderRadius: 3,
              border: `1px solid ${alpha(brand.main, .1)}`
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay actividades recientes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center !important' }}>
                Pronto publicaremos nuevas actividades.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => navigate('/conversatorios')}
                sx={{ mt: 1 }}
              >
                Ver todas las actividades
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <Box 
        component="ul" 
        sx={{ 
            listStyle: 'none',
            fontSize: '1rem',
            border: `1px solid ${brand.main}`,
            borderRadius: 2,
            backgroundColor: alpha(brand.main, .1),
            boxShadow: 2,
            p: 2,
            marginTop: 7,
            textAlign: 'center',
            transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 1
            }
        }}>
            <Typography variant="h6" color="primary">¡Contactanos!</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/contacto")} sx={{ marginTop: 2 }}>
              Contacto
            </Button>
        </Box>
      </SectionContainer>
    </Container>
  );
}