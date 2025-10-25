import * as React from 'react'
import { brand } from '../../shared-theme/themePrimitives'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import { Box, Typography, alpha } from '@mui/material'

export default function Mapa(){
    return(
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: { xs: 'column', md: 'row' }, m: 'auto', textAlign: 'left' }}>
              <Box sx={{
                display: { xs: 'none', md: 'block' },
                width: 300,
                height: 300,
                backgroundColor: alpha(brand.main, 0.1),
                border: `2px solid ${brand.main}`,
                borderRadius: 2,
                p: 3,
                position: 'relative',
                left: 50,
                zIndex: -1
              }}>
                <Box sx={{ maxWidth: '80%' }}>
                  <Typography variant="h6" sx={{ 
                    color: brand.main, 
                    fontWeight: 600, 
                    mb: 2 
                  }}>
                    Información de Contacto
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocationOnIcon sx={{ color: brand.main, mr: 1, mt: 0.5, fontSize: '1.2rem' }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Av. San Martín 4453
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        (C1417DSE) CABA, Argentina
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2">
                      ciepa@agro.uba.ar
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2">
                      +54 11 4576-3000
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Box
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.3203710553043!2d-58.482668399999994!3d-34.596059499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb619b429179f%3A0x54ed9c2042a608ae!2sFacultad%20de%20Agronom%C3%ADa%20-%20UBA!5e0!3m2!1ses-419!2sar!4v1760828510550!5m2!1ses-419!2sar" 
                sx={{ border: `2px solid ${brand.main}`,
                borderRadius: 2,
                width: 'auto',
                height: 300 }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" >
                </Box>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 1.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Av. San Martín 4453
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      (C1417DSE) CABA, Argentina
                    </Typography>
                  </Box>
                </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body2">
                  ciepa@agro.uba.ar
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ color: brand.main, mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="body2">
                  +54 11 4576-3000
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
    )
}