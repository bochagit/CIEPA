import * as React from 'react'
import logoGrande from '../assets/images/logo_grande.png'
import { Box } from '@mui/material'

export default function CiepaLogoGrande() {
    return (
        <Box component="img" src={logoGrande} sx={{
            height: '40vh',
            width: 'auto',
            margin: 'auto',
            objectFit: 'contain'
        }} />
    )
}