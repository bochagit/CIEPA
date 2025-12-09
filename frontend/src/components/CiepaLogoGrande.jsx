import * as React from 'react'
import logoGrande from '../assets/images/logo_grande.png'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function CiepaLogoGrande() {
    const navigate = useNavigate()
    const handleLogoClick = () => {
        navigate("/")
    }

    return (
        <Box component="img" onClick={handleLogoClick} src={logoGrande} sx={{
            height: '28vh',
            width: 'auto',
            margin: 'auto',
            mb: 2,
            objectFit: 'contain',
            cursor: 'pointer',
            transition: 'transform .2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.01)'
            }
        }} />
    )
}