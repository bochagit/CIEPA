import * as React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Container,
  Divider,
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { brand } from '../../shared-theme/themePrimitives';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
  const actividades = [
    {
      id: 1,
      titulo: "Conversatorio: Futuro de la Energía Renovable",
      fecha: "2024-11-20",
      hora: "18:00",
      modalidad: "Presencial + Virtual",
      descripcion: "Debate sobre las perspectivas y desafíos de la transición energética en Argentina."
    },
    {
      id: 2,
      titulo: "Taller: Metodologías de Evaluación Ambiental",
      fecha: "2024-11-15",
      hora: "14:00",
      modalidad: "Presencial",
      descripcion: "Capacitación en herramientas y técnicas para la evaluación de impacto ambiental."
    },
    {
      id: 3,
      titulo: "Seminario: Políticas Hídricas Regionales",
      fecha: "2024-11-10",
      hora: "16:00",
      modalidad: "Virtual",
      descripcion: "Análisis de las políticas de gestión del agua en el contexto regional."
    }
  ];

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
            <Chip
              label="Publicación"
              size="small"
              sx={{
                bgcolor: alpha(brand.main, .9),
                color: 'white',
                fontWeight: 600,
                mb: 2
              }}
              />
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
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" size="large" sx={{ borderRadius: 3, px: 4 }}>
            Ver todas las publicaciones
          </Button>
        </Box>
      </SectionContainer>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          Próximas Actividades
        </SectionTitle>
          {actividades.map((actividad) => (
              <Paper
                key={actividad.id}
                elevation={1} 
                sx={{ 
                  margin: 2,
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${alpha(brand.main, 0.1)}`,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <Grid container spacing={3} justifyContent="space-evenly" alignItems="center">
                    <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                        <Typography variant="h4" color="primary" fontWeight={700}>
                        {new Date(actividad.fecha).getDate()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {new Date(actividad.fecha).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight={600}>
                        {actividad.hora}
                        </Typography>
                    </Box>
                  <Grid width={500}>
                    <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                      {actividad.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {actividad.descripcion}
                    </Typography>
                    <Chip 
                      label={actividad.modalidad} 
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Grid>
                  <Grid>
                    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ borderRadius: 2, mb: 1, display: 'block', width: { xs: 'auto', md: '100%' } }}
                      >
                        Inscribirse
                      </Button>
                      <Button 
                        variant="text" 
                        size="small"
                        sx={{ borderRadius: 2, width: { xs: 'auto', md: '100%' } }}
                      >
                        Más información
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
          ))}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large" sx={{ borderRadius: 3, px: 4 }}>
            Ver calendario completo
          </Button>
        </Box>
      </SectionContainer>

      <Divider sx={{ my: 6 }} />

      <SectionContainer>
        <SectionTitle variant="h3" component="h2">
          Contacto
        </SectionTitle>
        <Grid container spacing={4}>
          <Grid>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(brand.main, 0.05)} 0%, ${alpha(brand.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(brand.main, 0.1)}`
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom fontWeight={600} color="primary">
                Información de Contacto
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ color: brand.main, mr: 2 }} />
                <Typography variant="body1">
                  contacto@ciepa.org.ar
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ color: brand.main, mr: 2 }} />
                <Typography variant="body1">
                  +54 11 1234-5678
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <LocationOnIcon sx={{ color: brand.main, mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="body1">
                    Av. San Martín 4453
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    (C1417DSE) CABA, Argentina
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Estamos aquí para responder tus consultas y fomentar la colaboración en temas ambientales.
              </Typography>
            </Paper>
          </Grid>
          <Grid width={'100%'}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom fontWeight={600} color="primary">
                Envíanos un mensaje
              </Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nombre completo
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${alpha(brand.main, 0.3)}`, 
                      borderRadius: 1,
                      bgcolor: alpha(brand.main, 0.02)
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      [Campo de entrada]
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${alpha(brand.main, 0.3)}`, 
                      borderRadius: 1,
                      bgcolor: alpha(brand.main, 0.02)
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      [Campo de entrada]
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Mensaje
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 2, 
                      minHeight: 100,
                      border: `1px solid ${alpha(brand.main, 0.3)}`, 
                      borderRadius: 1,
                      bgcolor: alpha(brand.main, 0.02)
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      [Área de texto]
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ borderRadius: 2, mt: 2 }}
                >
                  Enviar mensaje
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </SectionContainer>
    </Container>
  );
}