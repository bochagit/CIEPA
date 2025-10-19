import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CiepaLogo from './CiepaLogo';
import Mapa from './Mapa'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import { alpha } from '@mui/material';
import { brand } from '../../shared-theme/themePrimitives';

function Copyright() {
  return (
    <Box sx={{ maxWidth: { xs: '80%', md: '100%' }, textAlign: 'left' }}>
      <Typography variant="body2" sx={{ color: 'text.primary', mt: 1 }}>
        Centro Interdisciplinario de Estudios en Politicas Ambientales (CIEPA)
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }} >
          Creado formalmente por el Consejo Directivo de la Facultad de Agronomía de la UBA (RESCD-2023-870)
      </Typography>
    </Box>
  );
}

export default function Footer() {
  return (
    <React.Fragment>
      <Divider />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 4, sm: 8 },
          py: { xs: 8, sm: 10 },
          textAlign: 'left',
          backdropFilter: 'blur(10px)',
          minWidth: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: 'auto' }}>
            <Box sx={{ height: '100%', display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 3, justifyContent: 'center', alignItems: 'center' }}>
              <CiepaLogo />
              <Stack
                spacing={2}
                useFlexGap
                sx={{ justifyContent: 'left', color: 'text.secondary', flexDirection: 'row' }}
              >
                <IconButton
                  color="inherit"
                  size="medium"
                  href="https://www.instagram.com/ciepa.centro/"
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label="Instagram"
                  sx={{ alignSelf: 'center' }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="medium"
                  href="https://youtube.com/"
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label="YouTube"
                  sx={{ alignSelf: 'center' }}
                >
                  <YouTubeIcon />
                </IconButton>
              </Stack>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'stretch', height: 400, textAlign: 'left', position: { xs: 'static', sm: 'relative' }, left: 25 }}>
              <Box sx={{
                width: 300,
                height: 300,
                margin: 'auto',
                backgroundColor: alpha(brand.main, 0.1),
                border: `2px solid ${brand.main}`,
                borderRadius: 2,
                p: 3,
                display: {xs: 'none', sm: 'block'}
              }}>
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: brand.main, 
                    fontWeight: 600, 
                    mb: 2 
                  }}>
                    Información de Contacto
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocationOnIcon sx={{ color: brand.main, mr: 1, mt: 0.5, fontSize: '1.2rem' }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Av. San Martín 4453
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        (C1417DSE) CABA, Argentina
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2">
                      contacto@ciepa.org.ar
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2">
                      +54 11 4576-3000
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box sx={{
                  position: { xs: 'static', sm: 'relative' },
                  overflow: 'hidden',
                  left: -50,
                  height: 300,
                }}>
                  <Mapa />
                </Box>
                <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column' }} >
                  <Typography variant="h6" sx={{ 
                    color: brand.main, 
                    fontWeight: 600, 
                    mb: 2 
                  }}>
                    Información de Contacto
                  </Typography>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <LocationOnIcon sx={{ color: brand.main, mr: 1, mt: 0.5, fontSize: '1.2rem' }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Av. San Martín 4453
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        (C1417DSE) CABA, Argentina
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2">
                      contacto@ciepa.org.ar
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2">
                      +54 11 4576-3000
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Links
            </Typography>
            <Link color="text.secondary" variant="body2" href="#">
              Quienes somos
            </Link>
            <Link color="text.secondary" variant="body2" href="#">
              Notas
            </Link>
            <Link color="text.secondary" variant="body2" href="#">
              Contacto
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: { xs: 4, sm: 8 },
            width: '100%',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <div>
            <Copyright />
          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}
