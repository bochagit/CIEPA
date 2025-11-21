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
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import CiepaLogo from './CiepaLogo';
import { brand } from '../../shared-theme/themePrimitives';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Menu from '@mui/material/Menu';
import { useAuth } from '../context/AuthContext';


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

const menuData = {
  acerca: [
    { label: '¿Qué es el CIEPA?', href: '/quienes-somos' },
    { label: 'Principios', href: '/principios' },
    { label: 'Objetivos', href: '/objetivos' },
    { label: 'Integrantes', href: '/integrantes' }
  ],
  trabajo: [
    { label: 'Qué hacemos', href: '/que-hacemos' },
    { label: 'Ejes de trabajo', href: '/ejes' },
    { label: 'Asesoramiento técnico', href: '/asesoramiento' }
  ],
  publicaciones: [
    { label: 'Notas', href: '/notas' },
    { label: 'Informes', href: '/informes' },
    { label: 'Audiovisual', href: '/audiovisual' }
  ],
  actividades: [
    { label: 'Conversatorios', href: '/conversatorios' },
    { label: 'Ciclo de formaciones', href: '/formaciones' },
    { label: 'Jornadas', href: '/jornadas' }
  ],
  formacion: [
    { label: 'Materia Energías y Transición energética', href: '/' }
  ]
}

const menuLabels = {
  acerca: 'Acerca del CIEPA',
  trabajo: 'Nuestro trabajo',
  publicaciones: 'Publicaciones',
  actividades: 'Actividades',
  formacion: 'Formación'
}

export default function AppAppBar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth()
  const [activeSubmenu, setActiveSubmenu] = React.useState(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    if(!newOpen){
      setActiveSubmenu(null);
    }
  };

  const handleSignInClick = () => {
    navigate('/signin')
  };

  const handleLogout = () => {
    logout()
    navigate('/')
  };

  const handleDashboardClick = () => {
    navigate('/dashboard')
  }

  const handleMainMenuClick = (menuKey) => {
    setActiveSubmenu(menuKey);
  };

  const handleBackToMain = () => {
    setActiveSubmenu(null);
  };

  const handleNavigate = (href) => {
    navigate(href);
    setOpen(false);
    setActiveSubmenu(null);
  }

  const MenuButton = ({ menuKey, label, items }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isHovering, setIsHovering] = React.useState(false);
    const open = Boolean(anchorEl);
    const timeoutRef = React.useRef(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
      setIsHovering(false);
    }

    const handleMenuItemClick = (href) => {
      setAnchorEl(null);
      setIsHovering(false);
      navigate(href);
    };

    const handleMouseEnter = (event) => {
      if (timeoutRef.current){
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsHovering(true);
      setAnchorEl(event.currentTarget);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);

      if (!timeoutRef.current){
        timeoutRef.current = setTimeout(() => {
          if (!isHovering){
            setAnchorEl(null);
          }
          timeoutRef.current = null;
        }, 150);
      }
    };

    const handleMenuMouseEnter = () => {
      if (timeoutRef.current){
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsHovering(true);
    }

    const handleMenuMouseLeave = () => {
      setIsHovering(false);
      setAnchorEl(null);
    };

    React.useEffect(() => {
      if (!isHovering && timeoutRef.current){
        return;
      } else if (isHovering && timeoutRef.current){
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, [isHovering]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current){
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <>
        <Button 
          id={`${menuKey}-button`}
          aria-controls={open ? `${menuKey}-menu` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="text" 
          color="info" 
          size="medium" 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ color: '#222', display: { xs: 'none', md: 'flex' } }}>
            {label}
        </Button>

        <Menu
          id={`${menuKey}-menu`}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          data-menu={menuKey}
          autoFocus={false}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          slotProps={{
            paper: {
              elevation: 3,
              onMouseEnter: handleMenuMouseEnter,
              onMouseLeave: handleMenuMouseLeave,
              sx: {
                mt: .5,
                minWidth: 200,
                borderRadius: 2,
                backgroundColor: '#ebf7ed',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  height: 50,
                  '&:hover': {
                    backgroundColor: alpha(brand.main, .4)
                  },
                },
              }
            }
          }}
        >
          {items.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => handleMenuItemClick(item.href)}
              sx={{ py: 1, px: 2, '&:hover': { backgroundColor: alpha(brand.main, 0.4), color: 'primary.contrastText' } }}  
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
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
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <CiepaLogo />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'space-evenly', px: 0, gap: '1rem' }}>
              <MenuButton 
              menuKey="acerca" 
              label="Acerca del CIEPA" 
              items={menuData.acerca} 
              />
              <MenuButton 
                menuKey="trabajo" 
                label="Nuestro trabajo" 
                items={menuData.trabajo} 
              />
              <MenuButton 
                menuKey="publicaciones" 
                label="Publicaciones" 
                items={menuData.publicaciones} 
              />
              <MenuButton 
                menuKey="actividades" 
                label="Actividades" 
                items={menuData.actividades} 
              />
              <MenuButton 
                menuKey="formacion" 
                label="Formación" 
                items={menuData.formacion} 
              />
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => navigate('/contacto')}
                sx={{
                  color: '#222',
                  display: { xs: 'none', md: 'flex' },
                  '&:hover': {
                    backgroundColor: alpha(brand.main, .1)
                  }
                }}
              >
                Contacto
              </Button>
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
              slotProps={{
                paper: {
                  sx: {
                    top: 'var(--template-frame-height, 0px)',
                  }
                }
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                  }}
                >
                  {activeSubmenu && (
                    <IconButton onClick={handleBackToMain} aria-label="Volver">
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  {activeSubmenu && (
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', mr: 6 }}>
                      {menuLabels[activeSubmenu]}
                    </Typography>
                  )}
                  
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                {!activeSubmenu ? (
                  <>
                    {Object.entries(menuLabels).map(([key, label]) => (
                      <MenuItem key={key} onClick={() => handleMainMenuClick(key)}>
                        {label}...
                      </MenuItem>
                      ))}
                      <MenuItem onClick={() => handleNavigate('/contacto')}>
                        Contacto
                      </MenuItem>
                      <Divider sx={{ my: 3 }} />
                      <MenuItem>
                        {isAuthenticated ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              Hola, {user?.name}
                            </Typography>
                            <Button color="primary" variant="outlined" size="small" onClick={handleDashboardClick}>
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
                  </>
                ) : (
                  <>
                    {menuData[activeSubmenu].map((item, index) => (
                      <MenuItem key={index} onClick={() => handleNavigate(item.href)}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
