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
    <Typography variant="body2" sx={{ color: 'text.primary', mt: 1 }}>
      Centro Interdisciplinario de Estudios en Politicas Ambientales (CIEPA)
      <Typography variant="body2" sx={{ color: 'text.secondary' }} >
        Creado formalmente por el Consejo Directivo de la Facultad de Agronomía de la UBA (RESCD-2023-870)
      </Typography>
    </Typography>
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
            flexDirection: { xs: 'column', sm: 'row' },
            width: '80%',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              minWidth: { xs: '100%', sm: '60%' },
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '60%' }, display: {xs: 'block', sm:'flex'}, gap: '3rem'}}>
              <Box sx={{height: '100%', display: {xs: 'block', sm: 'flex'}, justifyContent: 'center', alignItems: 'center'}}>
                <CiepaLogo />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ fontWeight: 600, mt: 2 }}
                >
                  Suscribite al newsletter
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Suscribite para no perderte ninguna actualización
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap>
                  <TextField
                    id="email-newsletter"
                    hiddenLabel
                    size="small"
                    variant="outlined"
                    fullWidth
                    aria-label="Enter your email address"
                    placeholder="Tu correo..."
                    slotProps={{
                      htmlInput: {
                        autoComplete: 'off',
                        'aria-label': 'Enter your email address',
                      },
                    }}
                    sx={{ width: '250px' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ flexShrink: 0 }}
                  >
                    Suscribite
                  </Button>
                </Stack>
              </Box>
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
              Sobre nosotros
            </Link>
            <Link color="text.secondary" variant="body2" href="#">
              Noticias
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
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ justifyContent: 'left', color: 'text.secondary' }}
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
