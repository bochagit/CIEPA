import * as React from 'react';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import { Box, CssBaseline, Container } from '@mui/material';
import CiepaLogoGrande from './components/CiepaLogoGrande';
import TopBar from './components/TopBar';
import { useLocation } from 'react-router-dom';

export default function Layout({ children, ...props }) {
  const location = useLocation()

  React.useEffect(() => {
    window.scrollTo({
      top: 0, 
      left: 0,
      behavior: 'smooth'
    })
  }, [location.pathname])

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <TopBar />
        <Box sx={{
          width: '100%',
          height: 'auto',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          py: 2,
          px: 2
        }}>
          <CiepaLogoGrande />
        </Box>

      <Box sx={{
        height: { xs: '2.5rem', md: 0 },
        display: { xs: 'block', md: 'none' }
      }} />

      <AppAppBar />

      <Container
        maxWidth="lg"
        component="main"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          mt: 4, 
          mb: 10, 
          gap: 4, 
        }}
      >
        {children}
      </Container>
      <Footer />
    </AppTheme>
  );
}