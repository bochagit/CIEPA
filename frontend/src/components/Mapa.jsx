import * as React from 'react'
import { brand } from '../../shared-theme/themePrimitives'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

export default function Mapa(){
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const getMapSize = () => {
        if (isMobile) return { width: 300, height: 200 }
        return { width: 400, height: 300 }
    }

    const { width, height } = getMapSize()

    return(
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.3203710553043!2d-58.482668399999994!3d-34.596059499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb619b429179f%3A0x54ed9c2042a608ae!2sFacultad%20de%20Agronom%C3%ADa%20-%20UBA!5e0!3m2!1ses-419!2sar!4v1760828510550!5m2!1ses-419!2sar" 
            style={{ border: `2px solid ${brand.main}`, borderRadius: 15, width: width, height: height }}
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade" >
        </iframe>
    )
}