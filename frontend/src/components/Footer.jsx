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
import { EmailOutlined as EmailIcon } from '@mui/icons-material'
import CiepaLogo from './CiepaLogo';
import { useNavigate } from 'react-router-dom';
import { brand } from '../../shared-theme/themePrimitives'
import LogoBlanco from '../assets/images/logo_blanco.png'

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
  const navigate = useNavigate()

  const linkStyles = {
    fontSize: '1rem',
    fontWeight: 300,
    color: 'white',
    textDecoration: 'none',
    position: 'relative',
    cursor: 'pointer',
    '&::before': {
      content: '""',
      position: 'absolute',
      height: '1px',
      bottom: 0,
      left: 0,
      backgroundColor: '#fff',
    }
  }

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
          minWidth: '100%',
          backgroundColor: brand.main
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: 'auto' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
                <Box component="img" src={LogoBlanco} width={200} />
              </Box>
              <Stack
                spacing={2}
                useFlexGap
                sx={{ justifyContent: 'left', color: 'text.secondary', flexDirection: { xs: 'row', sm: 'column' } }}
              >
                <IconButton
                  color="inherit"
                  size="large"
                  href="https://youtube.com/"
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label="YouTube"
                  sx={{ alignSelf: 'center', borderRadius: '50%', color: brand.main, backgroundColor: '#fff !important' }}
                >
                  <YouTubeIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="large"
                  href="https://www.instagram.com/ciepa.centro/"
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label="Instagram"
                  sx={{ alignSelf: 'center', borderRadius: '50%', color: brand.main, backgroundColor: '#fff !important' }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="large"
                  href="https://youtube.com/"
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label="YouTube"
                  sx={{ alignSelf: 'center', borderRadius: '50%', color: brand.main, backgroundColor: '#fff !important' }}
                >
                  <EmailIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" color="white" sx={{ fontWeight: 800, fontSize: '1rem' }}>
              Links
            </Typography>
            <Link variant="body2" onClick={() => navigate("/quienes-somos")} sx={linkStyles}>
              ¿Qué es el CIEPA?
            </Link>
            <Link variant="body2" onClick={() => navigate("/que-hacemos")} sx={linkStyles}>
              Nuestro trabajo
            </Link>
            <Link variant="body2" onClick={() => navigate("/notas")} sx={linkStyles}>
              Notas
            </Link>
            <Link variant="body2" onClick={() => navigate("/actividades")} sx={linkStyles}>
              Actividades
            </Link>
            <Link variant="body2" onClick={() => navigate("/contacto")} sx={linkStyles}>
              Contacto
            </Link>
          </Box>
        </Box>
      </Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: 4,
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2
        }}
      >
        <Copyright />
      </Box>
    </React.Fragment>
  );
}
