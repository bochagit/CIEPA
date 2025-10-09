import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import CiepaLogo from './CiepaLogo';
import { brand } from '../../shared-theme/themePrimitives'
import Typography from '@mui/material/Typography'


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: alpha(brand.main, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  const checkUser = React.useCallback(() => {
    // Revisar localStorage
    let user = localStorage.getItem('currentUser')

    //si no hay en localStorage, revisar sessionStorage
    if (!user) {
      user = sessionStorage.getItem('currentUser')
    }

    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      setCurrentUser(null)
    }
  }, [])

  React.useEffect(() => {
    checkUser()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkUser()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChanged', handleStorageChange)
    }
  }, [checkUser])

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSignInClick = () => {
    navigate('/signin')
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    sessionStorage.removeItem('currentUser')
    setCurrentUser(null)
    window.dispatchEvent(new CustomEvent('userChanged'))
  }

  return (
    <AppBar
      position="sticky"
      enableColorOnDark
      sx={{
        top: '2.5rem',
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters sx={{ boxShadow: 'none' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, gap: '1rem'}}>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <CiepaLogo />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="medium" sx={{ color: '#222', ":hover": {color: '#eee'} }}>
                Sobre nosotros
              </Button>
              <Button variant="text" color="info" size="medium" sx={{ color: '#222', ":hover": {color: '#eee'} }}>
                Noticias
              </Button>
              <Button variant="text" color="info" size="medium" sx={{ color: '#222', ":hover": {color: '#eee'} }}>
                Contacto
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Hola, {currentUser.name}
                </Typography>
                <Button color="primary" variant="outlined" size="small" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button color="primary" variant="outlined" size="small" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </Box>
            ) : ( 
              <Button color="primary" variant="contained" size="small" onClick={handleSignInClick}>
                Log in
              </Button>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>Sobre nosotros</MenuItem>
                <MenuItem>Noticias</MenuItem>
                <MenuItem>Contacto</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  {currentUser ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        Hola, {currentUser.name}
                      </Typography>
                      <Button color="primary" variant="outlined" size="small" onClick={() => navigate('/dashboard')}>
                        Dashboard
                      </Button>
                      <Button color="primary" variant="outlined" size="small" onClick={handleLogout}>
                        Cerrar sesión
                      </Button>
                    </Box>
                  ) : (
                    <Button color="primary" variant="contained" size="small" onClick={handleSignInClick}>
                      Sign In
                    </Button>
                  )}
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
