import * as React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Container,
  Divider,
  Avatar
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { brand } from '../../shared-theme/themePrimitives';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';

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
  marginBottom: theme.spacing(6),
}));

export default function MainContent() {
const publicaciones = [
    {
      id: 1,
      titulo: "Impacto del cambio climático en la agricultura argentina",
      descripcion: "Análisis exhaustivo de los efectos del cambio climático en los sistemas productivos nacionales y sus implicancias para la seguridad alimentaria.",
      imagen: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
      fecha: "2024-10-15",
      autor: "Dr. María González"
    },
    {
      id: 2,
      titulo: "Políticas públicas ambientales: Una perspectiva regional",
      descripcion: "Estudio comparativo de las políticas ambientales implementadas en América Latina y sus resultados en la conservación del medio ambiente.",
      imagen: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
      fecha: "2024-10-10",
      autor: "Lic. Carlos Mendez"
    },
    {
      id: 3,
      titulo: "Biodiversidad urbana y planificación sostenible",
      descripcion: "Propuestas para integrar la conservación de la biodiversidad en el desarrollo urbano y crear ciudades más verdes y sostenibles.",
      imagen: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
      fecha: "2024-10-05",
      autor: "Dra. Ana López"
    }
  ];

  const actividades = [
    {
      id: 1,
      titulo: "Gobernanza climática federal en Argentina",
      descripcion: "Balance y perspectiva de la Ley 27520",
      imagen: "https://picsum.photos/600/400?random=1",
      fecha: "2024-11-20"
    },
    {
      id: 2,
      titulo: "Monitor Ambiental del Presupuesto 2025",
      descripcion: "¿Qué es la asignación hacia agosto?",
      imagen: "https://picsum.photos/600/400?random=2",
      fecha: "2024-11-15"
    },
    {
      id: 3,
      titulo: "FARN Environmental Report 2024",
      descripcion: "The future in dispute",
      imagen: "https://picsum.photos/600/400?random=3",
      fecha: "2024-11-10"
    },
    {
      id: 4,
      titulo: "Boletín Nº1 del Observatorio del RUO",
      descripcion: "",
      imagen: "https://picsum.photos/600/400?random=4",
      fecha: "2024-11-05"
    }
  ];

  const [currentPublicacion, setCurrentPublicacion] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      handleNextPublicacion();
    }, 5000)

    return () => clearInterval(interval);
  }, [currentPublicacion]);

  const handleNextPublicacion = () => {
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

  return (
    <Container maxWidth="lg">
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Acerca del CIEPA
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
          Somos un Centro de Estudios de la Universidad de Buenos Aires integrado por docentes, investigadores, graduada/os y estudiantes de diversas disciplinas que presentan interés y/o trabajan en políticas ambientales. <br />
          A través del estudio y análisis, buscamos aportar a la formulación y desarrollo de políticas públicas ambientales basadas en el conocimiento científico-técnico, promoviendo espacios de articulación, debate y divulgación que impulsen un desarrollo nacional con perspectiva ambiental y una mejor calidad de vida para las personas.
        </Typography>
        <Button variant="outlined" color="primary" sx={{ marginTop: "2rem" }}>
          Conocenos
        </Button>
      </HeroSection>

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
                      {new Date(publicaciones[currentPublicacion].fecha).toLocaleDateString('es-AR')}
                    </Typography>
                  </Box>
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
                        width: 12,
                        height: 12,
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
      </SectionContainer>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          Próximas Actividades
        </SectionTitle>
      </SectionContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }} >
          {actividades.map((actividad) => (
            <Box key={actividad.id} sx={{
              position: 'relative',
              width: { xs: '100%', sm: 'calc(50% - 12px)' },
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
            }} >
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
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2, md: 3 },
                background: 'linear-gradient(transparent, rgba(0, 0, 0, .8))',
                color: 'white'
              }} >
              <Typography variant="h6" component="h3" gutterBottom sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.3
              }}>
                {actividad.titulo}
              </Typography>
              {actividad.descripcion && (
                <Typography variant="body2" sx={{
                  mb: 2,
                  fontSize: { xs: '.8rem', md: '.9rem' },
                  lineHeight: 1.4,
                  opacity: .9
                }} >
                  {actividad.descripcion}
                </Typography>
              )}
              <Typography variant="caption" sx={{
                opacity: .8,
                fontSize: '.75rem',
              }}
              >
                {new Date(actividad.fecha).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Box>
          ))}
        </Box>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          ¡Contactate con nosotras/os!
        </SectionTitle>
        <Box sx={{ width: 300, height: 150, m: 'auto', mt: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2, border: `1px solid ${brand.main}` }} >
          <Button variant="contained" color="primary" sx={{ height: 50, '&:hover': { boxShadow: 4, backgroundColor: alpha(brand.main, 1), border: `1px solid ${brand.main}` } }} >
            Contacto
          </Button>
        </Box>
      </SectionContainer>
    </Container>
  );
}