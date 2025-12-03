import { Typography, Box, LinearProgress } from '@mui/material'
import * as React from 'react'

export default function MateriaEnergias(){
    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 5, width: '100%' }}>
            <Typography variant="h3" color="info">Próximamente...</Typography>
            <Typography variant="caption" color="text.secondary">En esta sección vamos a presentar contenido de cursos y formación académica.</Typography>
            <LinearProgress color="info" sx={{ width: '50%' }} />
        </Box>
    )
}