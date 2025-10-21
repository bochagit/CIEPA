import * as React from 'react'
import { styled, Typography, Box, alpha } from '@mui/material';
import { brand } from '../../shared-theme/themePrimitives';

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(4, 0),
}));

export default function Integrantes(){
    return(
        <SectionContainer>
            <Box component="ul" sx={{ 
                listStyle: 'none',
                fontSize: '1rem',
                border: `1px solid ${brand.main}`,
                borderRadius: 2,
                backgroundColor: alpha(brand.main, .1),
                boxShadow: 1,
                p: 2 
                }}>
                <li><strong>Directora:</strong> Dra. Martha F. Bargiela</li>
                <li><strong>Co-Directora:</strong> Dra. Patricia Lombardo</li>
                <li><strong>Coordinadora:</strong> Lic. Lucía Belén Yáñez</li>
                <li><strong>Coordinadora Comisión de Gestión Integral de Residuos con Inclusión Social:</strong> Lic. Lucía Jolias</li>
                <li><strong>Coordinadora Comisión de Cambio Climático y Energía:</strong> Mg. Lic. Mauro Giangarelli</li>
            </Box>
            <Typography variant="h4" color="primary" sx={{textDecoration: 'underline'}}>Integrantes</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, fontSize: '.9rem' }}>
                <li>Esp. Abg. Kevin Axel Costa.</li>
                <li>Lic. Cs. Amb. Carolina Puccetti.</li>
                <li>Lic. Cs. Amb. Melisa Mariel Aguirre.</li>
                <li>Lic. Cs. Amb. Sebastián Pessah.</li>
                <li>Abg. Ana Belén Segovia.</li>
                <li>Lic. Cs. Amb. Candela Pino.</li>
                <li>Lic. Cs. Amb. Valentina Balsari.</li>
                <li>Lic. Biológicas Rocío Melzi Fiorenza.</li>
                <li>Lic. Cs. Amb.  Julieta Liftenegger.</li>
                <li>Lic. Cs. Amb. Micaela García.</li>
                <li>Abg. Candela Piñeyro.</li>
                <li>Lic. Cs. Amb. Lucía Gutierrez.</li>
                <li>Lic. en Geografía María Belén Reyes.</li>
                <li>Est. Cs. Amb. Laura Andrea Bastia.</li>
                <li>Est. Cs. Bio. Adriel Magnetti.</li>
                <li>Est. Abg. Dante Ordoñez.</li>
                <li>Est. Cs. Fis. Oscar Martinez.</li>
            </Box>
        </SectionContainer>
    )
}