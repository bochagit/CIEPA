import * as React from 'react'
import { Box, Typography, styled } from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives';

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(4, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
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

export default function EjesTrabajo(){
    return(
        <SectionContainer>
            <SectionTitle variant="h3" component="h2">Ejes de trabajo</SectionTitle>
            <Typography variant="h5" color="primary">Comisiones de trabajo</Typography>
            <Typography variant="body1" color="textPrimary" sx={{ fontSize: '1rem', margin: '15px 0 15px 0' }}>
                En el CIEPA organizamos nuestro trabajo en comisiones, espacios donde se planifican, organizan y desarrollan actividades de estudio, intercambio, discusión y divulgación sobre las distintas áreas de intervención del CIEPA. Nos reunimos periódicamente para impulsar acciones como notas, informes, seminarios, conversatorios, charlas abiertas y paneles de discusión, fomentando el intercambio interdisciplinario y la construcción colectiva de conocimiento.
            </Typography>
            <Typography variant="h5" color="primary">Ejes estratégicos de trabajo:</Typography>
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