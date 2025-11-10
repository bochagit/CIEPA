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
import { useNavigate } from 'react-router-dom';


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
            justifyContent: 'space-around',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: 'auto' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
                <CiepaLogo />
                <Typography variant="body1" color="text.secondary">ciepa@agro.uba.ar</Typography>
              </Box>
              <Stack
                spacing={2}
                useFlexGap
                sx={{ justifyContent: 'left', color: 'text.secondary', flexDirection: { xs: 'row', sm: 'column' } }}
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
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Links
            </Typography>
            <Link color="text.secondary" variant="body2" onClick={() => navigate("/quienes-somos")} sx={{ '&:hover': { cursor: 'pointer' } }}>
              Quienes somos
            </Link>
            <Link color="text.secondary" variant="body2" onClick={() => navigate("/que-hacemos")} sx={{ '&:hover': { cursor: 'pointer' } }}>
              Qué hacemos
            </Link>
            <Link color="text.secondary" variant="body2" onClick={() => navigate("/notas")} sx={{ '&:hover': { cursor: 'pointer' } }}>
              Notas
            </Link>
            <Link color="text.secondary" variant="body2" onClick={() => navigate("/conversatorios")} sx={{ '&:hover': { cursor: 'pointer' } }}>
              Conversatorios
            </Link>
            <Link color="text.secondary" variant="body2" onClick={() => navigate("/contacto")} sx={{ '&:hover': { cursor: 'pointer' } }}>
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
