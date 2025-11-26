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
  Chip
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { brand } from '../../shared-theme/themePrimitives';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { eventService } from '../services/eventService';

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
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
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

        const response = await postService.getAllPosts({
          limit: 3,
          status: 'published',
          featured: true
        })

        console.log('Posts obtenidos: ', response)

        if (response.posts && response.posts.length > 0) {
          const publicacionesFormateadas = response.posts.map(post => ({
            id: post._id,
            titulo: post.title,
            descripcion: post.summary || post.content.substring(0, 200) + '...',
            imagen: post.coverImage,
            fecha: post.date,
            autor: post.author
          }))
          
        setPublicaciones(publicacionesFormateadas)
        } else {
          setPublicaciones([])
        }
      } catch(error) {
        console.error('Error al cargar publicaciones: ', error)
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
          const actividadesFormateadas = response.events
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
      const currentPost = publicaciones[currentPublicacion]
      navigate(`/notas/${currentPost.id}`)
    }
  }

  const handleVerActividad = (actividadId) => {
    navigate(`/actividades/${actividadId}`)
  }

  return (
    <Container maxWidth="lg">
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
        <Box sx={{ width: { xs: '100%', lg: '60%' }, height: 500, backgroundImage: 'url("https://cdn.prod.website-files.com/605baba32d94435376625d33/6514274293b790a99214bbd6_63d7a17b0c095a3d11423d53_team-celebration-ideas.webp")', backgroundPosition: 'center', backgroundSize: 'cover' , backgroundRepeat: 'no-repeat', borderRadius: { xs: '1.5rem', lg: '0 1.5rem 1.5rem 0' } }} />
      </Box>
      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          Nuestro Trabajo
        </SectionTitle>
        <StyledCard>
            <CardContent sx={{ textAlign: 'start', p: 2, display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box>
                    <Avatar sx={{ bgcolor: alpha(brand.main, 0.1), color: brand.main, width: 64, height: 64, margin: 'auto' }}>
                        <AnalyticsIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                        Análisis
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ width: '80%' }}>
                Estudiamos y producimos conocimiento científico-técnico crítico sobre las políticas ambientales implementadas a nivel local, nacional y regional. Desde un enfoque interdisciplinario realizamos análisis, diagnósticos y prospección de políticas ambientales.
                </Typography>
            </CardContent>
        </StyledCard>
        <StyledCard>
            <CardContent sx={{ textAlign: 'start', p: 2, display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box>
                    <Avatar sx={{ bgcolor: alpha(brand.main, 0.1), color: brand.main, width: 64, height: 64, margin: 'auto' }}>
                        <SchoolIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                        Formación
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ width: '80%' }}>
                Trabajamos la formación de profesionales y contribuimos a la democratización del conocimiento ambiental, promoviendo su acceso y difusión. Generamos espacios de intercambio, debate y aprendizaje que fortalecen capacidades y fomentan la construcción colectiva de soluciones frente a los desafíos ambientales.
                </Typography>
            </CardContent>
        </StyledCard>
        <StyledCard>
            <CardContent sx={{ textAlign: 'start', p: 2, display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box>
                    <Avatar sx={{ bgcolor: alpha(brand.main, 0.1), color: brand.main, width: 64, height: 64, margin: 'auto' }}>
                        <PublicIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                        Asesoramiento
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ width: '80%' }}>
                Estudiamos y asistimos técnicamente a la formulación, planificación e implementación de políticas públicas ambientales. Nuestro acompañamiento busca fortalecer la gestión ambiental, favorecer la toma de decisiones informada y promover políticas más efectivas.
                </Typography>
            </CardContent>
        </StyledCard>
      </SectionContainer>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          Últimas Publicaciones
        </SectionTitle>

        {errorPublicaciones && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorPublicaciones}
          </Alert>
        )}

        {loadingPublicaciones ? (
          <Box sx={{ position: 'relative', height: {xs: 400, md: 500}, borderRadius: 3, overflow: 'hidden', mb: 4 }}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        ) : publicaciones.length > 0 ? (
        <Box sx={{ position: 'relative', height: {xs: 400, md: 500}, borderRadius: 3, overflow: 'hidden', mb: 4, boxShadow: 3 }} >
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
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 3, md: 5 },
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
              fontSize: { xs: '.5rem', md: '2.1rem' }
            }}
            >
              {publicaciones[currentPublicacion].titulo}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                maxWidth: '800px',
                fontSize: { xs: '.9rem', md: '1rem' },
                lineHeight: 1.6
              }}
              >
                {publicaciones[currentPublicacion].descripcion}
              </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography variant="body2" sx={{ opacity: .9 }}>
                    Por {publicaciones[currentPublicacion].autor}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: .9 }}>
                    {formatDateForDisplay(publicaciones[currentPublicacion].fecha)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerPublicacion}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, .2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, .3)',
                    mt: 2,
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
                    width: 10,
                    height: 10,
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
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            border: `1px solid ${alpha(brand.main, .1)}`
          }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No hay publicaciones destacadas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Actualmente no tenemos publicaciones marcadas como destacadas.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/notas')}
              sx={{ mt: 1 }}
            >
              Ver todas las notas
            </Button>
          </Box>
        )}
      </SectionContainer>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          Últimas Actividades
        </SectionTitle>

        {errorActividades && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorActividades}
          </Alert>
        )}

        {loadingActividades ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 12px)' },
                height: { xs: 250, md: 300 }
              }}>
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 3 }} />
              </Box>
            ))}
          </Box>
        ) : actividades.length > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {actividades.map((actividad) => (
              <Box key={actividad.id} onClick={() => handleVerActividad(actividad.id)} sx={{
              position: 'relative',
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 12px)' },
              height: { xs: 250, md: 300 },
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 3,
              cursor: 'pointer',
              transition: 'transform .3s ease-in-out, box-shadow .3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
                }
              }} 
            >
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${actividad.imagen})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
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
                top: 12,
                left: 12,
                zIndex: 2
              }} >
                <Chip
                  label={getEventTypeLabel(actividad.tipo)}
                  color={getEventTypeColor(actividad.tipo)}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '.7rem'
                  }}
                />
              </Box>
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2, md: 3 },
                background: 'linear-gradient(transparent, rgba(0, 0, 0, .8))',
                color: '#fff'
              }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {actividad.titulo}
                </Typography>
                <Typography variant="caption" sx={{
                  opacity: .8,
                  fontSize: '.75rem'
                }}>
                  {formatDateForDisplay(actividad.fecha)}
                </Typography>
              </Box>
            </Box>
            ))}
            </Box>
          ) : (
            <Box sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: 'background.paper',
              borderRadius: 3,
              border: `1px solid ${alpha(brand.main, .1)}`
            }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No hay actividiades recientes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Pronto publicaremos nuevas actividades.
              </Typography>
            </Box>
          )}
        </SectionContainer>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          ¡Contactate con nosotras/os!
        </SectionTitle>
        <Box sx={{ width: 300, height: 150, m: 'auto', mt: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2, border: `1px solid ${brand.main}` }} >
          <Button variant="contained" color="primary" onClick={() => navigate("/contacto")} sx={{ height: 50, '&:hover': { boxShadow: 4, backgroundColor: alpha(brand.main, 1), border: `1px solid ${brand.main}` } }} >
            Contacto
          </Button>
        </Box>
      </SectionContainer>
    </Container>
  );
}