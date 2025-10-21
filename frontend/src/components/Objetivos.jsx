import * as React from 'react'
import { styled, Typography, Box } from '@mui/material';
import { brand } from '../../shared-theme/themePrimitives';

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

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4, 0),
}));

export default function Objetivos(){
    return (
        <SectionContainer sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: 4 }}>
            <SectionTitle variant="h3" component="h2">
                Objetivos
            </SectionTitle>
            <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                El objetivo principal del Centro Interdisciplinario de Estudios en Políticas Ambientales (CIEPA) es generar un espacio propicio para el estudio, el trabajo y el debate sobre las políticas ambientales de la Argentina y la región. Buscamos contribuir a la formulación e implementación de políticas públicas ambientales basadas en conocimiento científico-técnico, promoviendo instancias de articulación, discusión, divulgación y extensión que promuevan un desarrollo nacional con perspectiva ambiental orientado al mejoramiento de la calidad de vida de las personas.
            </Typography>
            <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                A través de reuniones periódicas promovemos la realización de actividades de estudio, formación, divulgación y prestación de servicios, en el marco de los siguientes objetivos específicos:
                <ul>
                    <li>
                        Producir conocimiento científico-técnico crítico sobre las políticas ambientales implementadas a nivel local, nacional y regional.
                    </li>
                    <li>
                        Contribuir a la formación de profesionales y contribuir a la democratización del conocimiento ambiental, promoviendo su acceso y difusión.
                    </li>
                    <li>
                        Estudiar y asistir técnicamente a la formulación e implementación de políticas públicas ambientales que fortalezcan la gestión ambiental y la toma de decisiones.
                    </li>
                    <li>
                        Fomentar la articulación interdisciplinaria entre grupos académicos y la cooperación con instituciones nacionales e internacionales que trabajen con política ambiental.
                    </li>
                    <li>
                        Fortalecer la vinculación con organismos estatales, organizaciones sociales y de la sociedad civil, para construir respuestas conjuntas frente a los desafíos ambientales.
                    </li>
                    <li>
                        Participar activamente en el debate público, promoviendo la reflexión crítica en torno a las principales problemáticas ambientales y la ejecución de las políticas relacionadas.
                    </li>
                </ul>
            </Typography>
        </SectionContainer>
    )
}