import * as React from 'react'
import { Box, Typography, styled, IconButton } from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives'
import { secondary } from '../../shared-theme/themePrimitives';
import { Email as EmailIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import proyectosImage6 from '../assets/images/static-photos/6.jpg'
import proyectosImage7 from '../assets/images/static-photos/7.jpg'
import proyectosImage8 from '../assets/images/static-photos/8.jpg'

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(4, 0),
  '& .MuiTypography-body1, & .MuiTypography-body2': {
    textAlign: 'justify'
  }
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

export default function Proyectos(){
  const navigate = useNavigate()
    const fotosConsultoria = [
    {
      id: 1,
      imagen: proyectosImage6
    },
    {
      id: 2,
      imagen: proyectosImage7
    },
    {
      id: 3,
      imagen: proyectosImage8
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
          <SectionTitle variant="h3" component="h2" sx={{ marginBottom: 5 }}>Proyectos ejecutados</SectionTitle>
          <Typography variant="h4" color="primary">Asistencia técnica para la formulación, desarrollo y seguimiento de políticas ambientales en el Municipio de Mercedes, Provincia de Buenos Aires.</Typography>
          <Typography variant="subtitle1" color="primary">Período: 2025.</Typography>
          <Typography variant="body1" color="textPrimary" sx={{ fontSize: '1rem', marginBlock: 2 }}>Se ejecutó un proyecto de asistencia técnica para la elaboración, desarrollo y seguimiento de la política ambiental del municipio de Mercedes, Provincia de Buenos Aires.<br />
          La asistencia técnica tuvo como objetivo conformar una estrategia integral que identifique y aborde los principales desafíos ambientales del municipio, acompañe la elaboración e implementación de iniciativas y proyectos relacionados, promueva la participación comunitaria y mejore la calidad de vida de los y las vecinas del municipio.
          </Typography>
          <Box sx={{ position: 'relative', height: {xs: 400, md: 600}, borderRadius: 3, overflow: 'hidden', mt: 6, boxShadow: 3 }}>
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