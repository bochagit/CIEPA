import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
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
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';




const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  backdropFilter: 'blur(24px)',
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px'
}));

const menuData = {
  acerca: [
    { label: '¿Qué es el CIEPA?', href: '/quienes-somos' },
    { label: 'Principios', href: '/principios' },
    { label: 'Nuestro trabajo', href: '/que-hacemos' },
  ],
  consultoria: [
    { label: 'Líneas de trabajo', href: '/lineas-trabajo' },
    { label: 'Proyectos ejecutados', href: '/proyectos' }
  ],
  publicaciones: [
    { label: 'Notas', href: '/notas' },
    { label: 'Informes', href: '/informes' },
    { label: 'Audiovisual', href: '/audiovisual' }
  ],
  formacion: [
    { label: 'Materia Energías y Transición energética', href: '/cursos' }
  ]
}

const menuLabels = {
  acerca: 'Acerca del CIEPA',
  consultoria: 'Consultoría y Asesoramiento Técnico',
  publicaciones: 'Publicaciones',
  formacion: 'Cursos y Formación Académica'
}

export default function AppAppBar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth()
  const [activeSubmenu, setActiveSubmenu] = React.useState(null);

  const [isSticky, setIsSticky] = React.useState(false)
  const [originalTop, setOriginalTop] = React.useState(0)
  const [appBarHeight, setAppBarHeight] = React.useState(0)
  const appBarRef = React.useRef(null)

  React.useEffect(() => {
    const handleScroll = () => {
      if (!appBarRef.current) return;

      const rect = appBarRef.current.getBoundingClientRect();
      const targetPosition = 40;

      if (appBarHeight === 0){
        setAppBarHeight(rect.height)
      }

      if (!isSticky && rect.top <= targetPosition) {
        setOriginalTop(window.pageYOffset + rect.top);
        setIsSticky(true);
      } else if (isSticky && window.pageYOffset < originalTop - targetPosition) {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky, originalTop]);

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
          size="medium" 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ color: '#fff', display: { xs: 'none', md: 'flex' } }}>
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
              elevation: 4,
              onMouseEnter: handleMenuMouseEnter,
              onMouseLeave: handleMenuMouseLeave,
              sx: {
                mt: .5,
                minWidth: 200,
                borderRadius: 2,
                backgroundColor: '#fff',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  height: 50,
                  '&:hover': {
                    backgroundColor: alpha(brand.main, .8)
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
    <>
      {isSticky && (
        <Box sx={{ height: appBarHeight }} />
      )}
      <Box
        ref={appBarRef}
        sx={{
          position: isSticky ? 'fixed' : 'static',
          top: isSticky ? '40px' : 'auto',
          left: 0,
          right: 0,
          zIndex: 1200,
          transition: 'all 0.2s ease-out',
          width: '100vw',
          maxWidth: '100vw',
        }}
      >
        <Container maxWidth="false" sx={{ backgroundColor: alpha(brand.main, .8) }}>
          <StyledToolbar variant="dense" disableGutters sx={{ boxShadow: 'none' }}>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <CiepaLogo />
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'space-evenly', px: 0, gap: '1rem' }}>
                <IconButton aria-label="home" size="medium" onClick={() => handleNavigate('/')} sx={{ color: '#fff', bgcolor: 'transparent !important', border: 'none', '&:hover': { backgroundColor: `${alpha(brand.main, .2)} !important` } }}>
                  <HomeOutlinedIcon />
                </IconButton>
                <MenuButton 
                  menuKey="acerca" 
                  label="Acerca del CIEPA" 
                  items={menuData.acerca} 
                />
                <MenuButton
                  menuKey="consultoria"
                  label="Consultoría y Asesoramiento Técnico"
                  items={menuData.consultoria}
                />
                <MenuButton 
                  menuKey="publicaciones" 
                  label="Publicaciones" 
                  items={menuData.publicaciones} 
                />
                <Button
                  variant="text"
                  color="info"
                  size="medium"
                  onClick={() => navigate('/actividades')}
                  sx={{
                    color: '#fff',
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                      backgroundColor: alpha(brand.main, .2)
                    }
                  }}
                >
                  Actividades
                </Button>
                <MenuButton 
                  menuKey="formacion" 
                  label="Cursos y Formación Académica" 
                  items={menuData.formacion} 
                />
                <Button
                  variant="text"
                  color="info"
                  size="medium"
                  onClick={() => navigate('/contacto')}
                  sx={{
                    color: '#fff',
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                      backgroundColor: alpha(brand.main, .2)
                    }
                  }}
                >
                  Contacto
                </Button>
                <IconButton aria-label="search" size="medium" sx={{ color: '#fff', bgcolor: 'transparent !important', border: 'none', '&:hover': { backgroundColor: `${alpha(brand.main, .2)} !important` } }}>
                  <SearchOutlinedIcon />
                </IconButton>
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
                        <MenuItem onClick={() => handleNavigate('/actividades')}>
                          Actividades
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate('/contacto')}>
                          Contacto
                        </MenuItem>
                        <MenuItem>
                          Buscar
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate('/')}>
                          Volver al inicio
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
      </Box>
    </>
  );
}
