import * as React from 'react'
import {
    Box,
    Chip,
    Container,
    LinearProgress,
    Typography,
    alpha,
} from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives'

export default function ProblematicasSocioambientales() {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 3,
                    width: '100%',
                    minHeight: '55vh',
                    py: 8,
                    px: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(brand.main, 0.1)}`,
                    backgroundColor: alpha(brand.main, 0.05),
                }}
            >
                <Chip label="Curso de capacitación" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{ fontWeight: 700, color: 'text.primary', maxWidth: 640 }}
                >
                    Problemáticas Socioambientales
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, lineHeight: 1.8 }}>
                    En esta sección vamos a presentar el contenido de este curso.
                </Typography>
                <Box sx={{ width: '100%', maxWidth: 420, mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: brand.main, mb: 1.5 }}>
                        Próximamente
                    </Typography>
                    <LinearProgress
                        color="primary"
                        sx={{
                            height: 8,
                            borderRadius: 999,
                            backgroundColor: alpha(brand.main, 0.15),
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: brand.main,
                            },
                        }}
                    />
                </Box>
            </Box>
        </Container>
    )
}
