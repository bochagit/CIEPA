import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import { Box } from '@mui/material';
import CiepaLogoGrande from './components/CiepaLogoGrande';
import TopBar from './components/TopBar';

export default function Layout({ children, ...props }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <TopBar />
      <Box sx={{width: '100%', height: 'auto', display: {xs: 'none', md: 'flex'}, alignItems: 'center', marginTop: '2rem' }}>
        <CiepaLogoGrande />
      </Box>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 10, gap: 4 }}
      >
        {children}
      </Container>
      <Footer />
    </AppTheme>
  );
}