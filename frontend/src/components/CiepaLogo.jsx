import * as React from 'react';
import logo from '../assets/images/logo.png'
import { Box } from '@mui/material';

export default function CiepaLogo() {
  return (
    <Box component="img" src={logo} sx={{
      height: {xs: 32, md: 40},
      width: 'auto',
      objectFit: 'contain',
      cursor: 'pointer',
      transition: 'transform .2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)'
      }
      }
    } />
  )
}
