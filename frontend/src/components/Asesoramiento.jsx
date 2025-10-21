import * as React from 'react'
import { Box, Typography, styled, alpha, Button } from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives'

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
                <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                  contacto
                </Button>
            </Box>
        </SectionContainer>
    )
}