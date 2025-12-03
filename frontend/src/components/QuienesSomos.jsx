import * as React from 'react'
import { styled, Typography, Box, alpha, IconButton } from '@mui/material';
import { brand } from '../../shared-theme/themePrimitives';
import { secondary } from '../../shared-theme/themePrimitives';
import quienesSomosImage from '../assets/images/static-photos/2.jpeg'
import { Email as EmailIcon } from '@mui/icons-material';
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
  '& .MuiTypography-body1, & .MuiTypography-body2': {
    textAlign: 'justify'
  }
}));

export default function QuienesSomos(){
    return(
        <SectionContainer sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: 3 }}>
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
            <Box sx={{ mt: '2rem', maxWidth: '100%', height: 600, border: `1px solid ${alpha(brand.main, 1)}`, borderRadius: '1.5rem', backgroundImage: `url(${quienesSomosImage})`, backgroundPosition: 'center', backgroundSize: 'cover' , backgroundRepeat: 'no-repeat' }} />
            <Box 
                component="ul" 
                sx={{ 
                    listStyle: 'none',
                    fontSize: '1rem',
                    borderRadius: 2,
                    backgroundColor: alpha(brand.main, .1),
                    boxShadow: 1,
                    p: 2 
                }}>
                <li><strong>Directora:</strong> Dra. Martha F. Bargiela</li>
                <li><strong>Co-Directora:</strong> Dra. Patricia Lombardo</li>
                <li><strong>Coordinadora:</strong> Lic. Lucía Belén Yáñez</li>
                <li><strong>Coordinadora Comisión de Gestión Integral de Residuos con Inclusión Social:</strong> Lic. Lucía Jolias</li>
                <li><strong>Coordinadora Comisión de Cambio Climático y Energía:</strong> Mg. Lic. Mauro Giangarelli</li>
            </Box>
            <Typography variant="h4" color="primary" sx={{textDecoration: 'underline'}}>Integrantes</Typography>
            <Box component="ul" sx={{ px: 2, fontSize: '.9rem' }}>
                <li>Esp. Abg. Kevin Axel Costa.</li>
                <li>Lic. Cs. Amb. Carolina Puccetti.</li>
                <li>Lic. Cs. Amb. Melisa Mariel Aguirre.</li>
                <li>Lic. Cs. Amb. Sebastián Pessah.</li>
                <li>Abg. Ana Belén Segovia.</li>
                <li>Lic. Cs. Amb. Candela Pino.</li>
                <li>Lic. Cs. Amb. Valentina Balsari.</li>
                <li>Lic. Biológicas Rocío Melzi Fiorenza.</li>
                <li>Lic. Cs. Amb.  Julieta Liftenegger.</li>
                <li>Lic. Cs. Amb. Micaela García.</li>
                <li>Abg. Candela Piñeyro.</li>
                <li>Lic. Cs. Amb. Lucía Gutierrez.</li>
                <li>Lic. en Geografía María Belén Reyes.</li>
                <li>Est. Cs. Amb. Laura Andrea Bastia.</li>
                <li>Est. Cs. Bio. Adriel Magnetti.</li>
                <li>Est. Abg. Dante Ordoñez.</li>
                <li>Est. Cs. Fis. Oscar Martinez.</li>
            </Box>
        </SectionContainer>
    )
}