import * as React from 'react'
import { Box, Typography, styled, IconButton } from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives';
import { secondary } from '../../shared-theme/themePrimitives';
import { Email as EmailIcon } from '@mui/icons-material';

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

export default function QueHacemos(){
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
            <SectionTitle variant="h3" component="h2">Qué hacemos</SectionTitle>
            <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                Desde el CIEPA entendemos que el surgimiento de las problemáticas ambientales no solo tienen consecuencia directa en el deterioro de distintos ecosistemas, sino también impactos en la calidad de vida de la población, especialmente en los sectores más vulnerados. <br />
                En ese marco, desde la interdisciplina y bajo un enfoque integrador, el Centro de Estudios busca generar lazos propositivos y articular esfuerzos de diferentes actores para analizar, debatir y acercar miradas y soluciones a las problemáticas que se le presenten y/o se proponga abordar. A partir de ello se propone:
            </Typography>
            <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                <Box component="ul" sx={{ lineHeight: 2 }}>
                    <li>Elaborar informes técnicos, publicaciones temáticas, documentos de trabajo, y artículos académicos.</li>
                    <li>Realizar relevamientos, análisis, diagnósticos y prospección de políticas ambientales.</li>
                    <li>Prestar servicios de consultoría y asesoramiento para la formulación, planificación e implementación de políticas ambientales.</li>
                    <li>Realizar cursos, pasantías, seminarios, workshops, talleres y ciclos de charlas de capacitación para profesionales y estudiantes.</li>
                    <li>Generar canales de comunicación entre la academia y la sociedad en pos de la socialización de la información y la educación ambiental del público en general.</li>
                    <li>Realizar eventos, jornadas, actividades abiertas, talleres y mesas de discusión y debate que permitan fomentar el intercambio de ideas, saberes y experiencias, así como la difusión del conocimiento.</li>
                    <li>Impulsar espacios de participación abiertos a la comunidad que permitan la discusión de temas de interés afines al objeto de estudio.</li>
                </Box>
            </Typography>
            <SectionTitle variant="h3" component="h2" sx={{ pt: 2 }}>Ejes de trabajo</SectionTitle>
              <Typography variant="h4" color="primary">Comisiones de trabajo</Typography>
              <Typography variant="body1" color="textPrimary" sx={{ fontSize: '1rem', margin: '15px 0 15px 0' }}>
                  En el CIEPA organizamos nuestro trabajo en comisiones, espacios donde se planifican, organizan y desarrollan actividades de estudio, intercambio, discusión y divulgación sobre las distintas áreas de intervención del CIEPA. Nos reunimos periódicamente para impulsar acciones como notas, informes, seminarios, conversatorios, charlas abiertas y paneles de discusión, fomentando el intercambio interdisciplinario y la construcción colectiva de conocimiento.
              </Typography>
              <Typography variant="h4" color="primary">Ejes estratégicos de trabajo:</Typography>
              <Box component="ul" sx={{ fontSize: '1rem', lineHeight: 2 }}>
                  <li>Cambio Climático y Energía</li>
                  <li>Gestión Integral de Residuos con Inclusión Social</li>
                  <li>Desarrollo Rural y Soberanía Alimentaria</li>
                  <li>Ordenamiento ambiental del territorio y bienes comunes naturales</li>
                  <li>Contaminación, Impacto Ambiental, tecnología e innovación</li>
              </Box>
              <Box component="ul" sx={{ fontSize: '1rem', lineHeight: 2, listStyle: 'circle' }}>
                  <li>Ejes transversales: ecología política, perspectiva de género, participación ciudadana, derecho ambiental.</li>
              </Box>
        </SectionContainer>
    )
}