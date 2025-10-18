import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CiepaLogo from './CiepaLogo';

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
          textAlign: { sm: 'center', md: 'left' },
          backdropFilter: 'blur(10px)',
          minWidth: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '80%',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: '3rem' }}>
            <Box sx={{ height: '100%', display: { xs: 'block', sm: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
              <CiepaLogo />
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
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
          <Stack
            spacing={1}
            useFlexGap
            sx={{ justifyContent: 'left', color: 'text.secondary', flexDirection: { xs: 'column', md: 'row' } }}
          >
            <IconButton
              color="inherit"
              size="small"
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
              size="small"
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
      </Container>
    </React.Fragment>
  );
}
