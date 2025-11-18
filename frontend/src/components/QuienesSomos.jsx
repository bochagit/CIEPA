import * as React from 'react'
import { styled, Typography, Box, alpha } from '@mui/material';
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
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4, 0),
}));

export default function QuienesSomos(){
    return(
        <SectionContainer sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: 3 }}>
            <SectionTitle variant="h3" component="h2">
                ¿Qué es el CIEPA?
            </SectionTitle>
            <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                Somos un Centro de Estudios de la Universidad de Buenos Aires integrado por docentes, investigadores, graduada/ os y estudiantes de diversas disciplinas que tenemos interés y/o trabajan en políticas ambientales.
                A través del estudio, buscamos aportar a la formulación, análisis y desarrollo de políticas públicas ambientales basadas en el conocimiento científico-técnico, promoviendo espacios de articulación, debate y divulgación que impulsen un desarrollo nacional con perspectiva ambiental y una mejor calidad de vida para las personas.
            </Typography>
            <Typography variant="h4" color="primary">Somos interdisciplinaria/os</Typography>
            <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                Entendemos que la política ambiental requiere un abordaje transversal que involucre múltiples ámbitos, saberes y sectores. Por eso, reunimos a docentes, investigadores, graduadas/os y estudiantes de diversas disciplinas que comparten el interés y el compromiso por las políticas ambientales.
            </Typography>
            <Typography variant="h4" color="primary">Somos comprometidas/os</Typography>
            <Typography variant="body1" color="textPrimary" fontSize={'1rem'}>
                Creemos que las instituciones académicas deben involucrarse y contribuir activamente, mediante la discusión, el análisis y el abordaje de las principales problemáticas que aquejan a nuestra sociedad, co-construyendo junto al Estado y actores de la sociedad civil, las mejores alternativas para su resolución. Es por ello que trabajamos con compromiso, cooperación y responsabilidad.
            </Typography>
            <Box sx={{ mt: '2rem', maxWidth: '100%', height: 400, border: `2px solid ${alpha(brand.main, 1)}`, borderRadius: '1.5rem', backgroundImage: 'url("https://cdn.prod.website-files.com/605baba32d94435376625d33/6514274293b790a99214bbd6_63d7a17b0c095a3d11423d53_team-celebration-ideas.webp")', backgroundPosition: 'center', backgroundSize: 'cover' , backgroundRepeat: 'no-repeat' }} />
        </SectionContainer>
    )
}