import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import CiepaLogo from './CiepaLogo';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth()

  const handleBackToBlog = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    React.useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    React.useState(false);

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [
      isOverMdViewport,
      setIsDesktopNavigationExpanded,
      setIsMobileNavigationExpanded,
    ],
  );

  const handleToggleHeaderMenu = React.useCallback(
    (isExpanded) => {
      setIsNavigationExpanded(isExpanded);
    },
    [setIsNavigationExpanded],
  );

  const layoutRef = React.useRef(null);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1300,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80
      }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToBlog}
        >
          Volver al Blog
        </Button>
        
        <Typography variant="h6">
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          Panel de control | </Box>
          CIEPA
        </Typography>

        <Button 
          variant="outlined"
          color="secondary" 
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Box>

      <Box sx={{ pt: '80px', flex: 1, display: 'flex', height: '100vh', overflow: 'hidden', background: (theme.vars || theme).palette.background.default }}>
        <Box
          ref={layoutRef}
          sx={{
            position: 'relative',
            display: 'flex',
            width: '100%',
            height: '100%'
          }}
        >
          <DashboardHeader
            logo={<CiepaLogo />}
            title=""
            menuOpen={isNavigationExpanded}
            onToggleMenu={handleToggleHeaderMenu}
          />
          <DashboardSidebar
            expanded={isNavigationExpanded}
            setExpanded={setIsNavigationExpanded}
            container={layoutRef?.current ?? undefined}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: 0,
              height: '100%'
            }}
          >
            <Toolbar sx={{ displayPrint: 'none' }} />
            <Box
              component="main"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'auto',
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}