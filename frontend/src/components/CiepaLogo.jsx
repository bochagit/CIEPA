import * as React from 'react';
import logo from '../assets/images/logo.png'
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CiepaLogo() {
  const navigate = useNavigate()
  const handleLogoClick = () => {
    navigate("/")
  }

  return (
    <Box component="img" src={logo} onClick={handleLogoClick} sx={{
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
