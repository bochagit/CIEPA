import * as React from 'react'
import { Box, Typography, styled } from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives';

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

export default function QueHacemos(){
    return(
        <SectionContainer>
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
        </SectionContainer>
    )
}