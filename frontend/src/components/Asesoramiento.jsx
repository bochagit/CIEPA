import * as React from 'react'
import { Box, Typography, styled, alpha, Button } from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives'
import { useNavigate } from 'react-router-dom';

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
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

export default function Asesoramiento(){
  const navigate = useNavigate()
    const fotosConsultoria = [
    {
      id: 1,
      imagen: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80"
    },
    {
      id: 2,
      imagen: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80"
    },
    {
      id: 3,
      imagen: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80"
    }
  ];
    const [currentFoto, setCurrentFoto] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    React.useEffect(() => {
    const interval = setInterval(() => {
        handleNextFoto();
    }, 5000)

    return () => clearInterval(interval);
    }, [currentFoto]);

    const handleNextFoto = () => {
    setIsTransitioning(true);

    setTimeout(() => {
        setCurrentFoto((prev) => (prev + 1) % fotosConsultoria.length);
        setIsTransitioning(false);
    }, 300);
    };

    return(
        <SectionContainer>
            <SectionTitle variant="h3" component="h2">Asesoramiento técnico</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 5 }}>
                <Typography variant="body1" color="textPrimary" fontSize="1rem">
                    Desde el CIEPA prestamos servicios de consultoría y asesoramiento personalizado para apoyar la formulación, planificación e implementación de políticas ambientales. Nuestro trabajo combina conocimiento científico-técnico con una perspectiva interdisciplinaria, articulando esfuerzos entre distintos actores académicos, estatales y de la sociedad civil.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize="1rem">
                    A través de este acompañamiento, buscamos contribuir a la mejora de la toma de decisiones en distintos niveles de gestión, elaborando estudios, informes, diagnósticos y recomendaciones que apoyan la implementación de políticas más efectivas.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize="1rem">
                    Asimismo, promovemos la construcción de capacidades, generando espacios de formación e  intercambio que fortalecen el diseño de alternativas frente a los desafíos ambientales locales, nacionales y regionales.
                </Typography>
            </Box>
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
                <Typography variant="h6" color="primary">¿Estás interesada/o? ¡Contactate con nosotras/os!</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate("/contacto")} sx={{ marginTop: 2 }}>
                  contacto
                </Button>
            </Box>
            <SectionTitle variant="h3" component="h2" sx={{ marginTop: 5 }}>Proyectos ejecutados</SectionTitle>
            <Typography variant="h4" color="primary">Asistencia técnica para la formulación, desarrollo y seguimiento de políticas ambientales en el Municipio de Mercedes, Provincia de Buenos Aires.</Typography>
            <Typography variant="subtitle1" color="primary">Período: 2025.</Typography>
            <Typography variant="body1" color="textPrimary" sx={{ fontSize: '1rem', marginBlock: 2 }}>Se ejecutó un proyecto de asistencia técnica para la elaboración, desarrollo y seguimiento de la política ambiental del municipio de Mercedes, Provincia de Buenos Aires.<br />
            La asistencia técnica tuvo como objetivo conformar una estrategia integral que identifique y aborde los principales desafíos ambientales del municipio, acompañe la elaboración e implementación de iniciativas y proyectos relacionados, promueva la participación comunitaria y mejore la calidad de vida de los y las vecinas del municipio.
            </Typography>
            <Box sx={{ position: 'relative', height: {xs: 300, md: 400}, borderRadius: 3, overflow: 'hidden', mt: 6, boxShadow: 3 }}>
                <Box 
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${fotosConsultoria[currentFoto].imagen})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: isTransitioning ? 0 : 1,
                    transition: 'opacity .5s ease-in-out'
                }} />
            </Box>
        </SectionContainer>
    )
}