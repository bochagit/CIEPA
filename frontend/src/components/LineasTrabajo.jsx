import * as React from 'react'
import { Box, Typography, styled, Button, IconButton } from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives'
import { Email as EmailIcon } from '@mui/icons-material';

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(4, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: brand.main,
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 60,
    height: 3,
    backgroundColor: brand.main,
    borderRadius: 2,
  }
}));

export default function Lineas(){
    return(
        <SectionContainer>
            <SectionTitle variant="h3" component="h2">Líneas de trabajo</SectionTitle>
            <IconButton
                color="inherit"
                size="large"
                href="mailto:ciepa@agro.uba.ar"
                target='_blank'
                rel='noopener noreferrer'
                aria-label="Email"
                sx={{
                    position: 'fixed',
                    bottom: 40,
                    right: 50,
                    alignSelf: 'center', 
                    borderRadius: '50%', 
                    transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out, border-radius .2s ease-in-out', 
                    '&:hover': 
                        { 
                            transform: 'translateY(-4px)', 
                            boxShadow: 3
                        }, 
                    '&::before':
                        {
                            content: { xs: '""', lg: '"Contactate"' }, 
                            position: 'absolute', 
                            fontSize: '.8rem',
                            color: 'text.secondary', 
                            top: -22,
                            fontWeight: 400 
                        },
                    '&::after': 
                        { 
                            content: { xs: '""', lg: '"ciepa@agro.uba.ar"' }, 
                            position: 'absolute', 
                            fontSize: '.8rem', 
                            color: 'text.secondary', 
                            top: 50, 
                            fontWeight: 400 
                        }
                }}
            >
                <EmailIcon />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 5 }}>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Desde el CIEPA prestamos servicios de consultoría y asesoramiento personalizado para apoyar la formulación, planificación e implementación de políticas ambientales. Nuestro trabajo combina conocimiento científico-técnico con una perspectiva interdisciplinaria, articulando esfuerzos entre distintos actores académicos, estatales y de la sociedad civil. Se promueve la integración entre  las capacidades de gestión de los gobiernos municipales, empresas privadas y el conocimiento técnico, político y científico desarrollado en la universidad, con el fin de acompañar procesos de planificación ambiental participativos y adaptados a cada territorio.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    A través de este acompañamiento, buscamos contribuir a la mejora de la toma de decisiones en distintos niveles de gestión, elaborando estudios, informes, diagnósticos y recomendaciones que apoyan la implementación de políticas más efectivas. 
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Asimismo, promovemos la construcción de capacidades, generando espacios de formación e  intercambio que fortalecen el diseño de alternativas frente a los desafíos ambientales locales, nacionales y regionales.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Para lograrlo, desarrollamos diversas líneas de trabajo orientadas a la formulación, gestión y evaluación de políticas públicas ambientales promoviendo instancias de formación y capacitación. 
                </Typography>
                <Typography variant="h4" color="primary" sx={{ '&::before': { content: '"• "' } }}>Plan Estratégico Ambiental</Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Esta línea busca acompañar a los gobiernos locales en la formulación de su plan estratégico ambiental, entendido como una hoja de ruta para el desarrollo de políticas públicas que pongan en consideración las necesidades actuales y las demandas futuras. El trabajo puede incluir las siguientes etapas:
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', '& li::before': { content: '"- "' }, px: 2, fontSize: '1rem' }}>
                    <li>
                        Una etapa de diagnóstico participativo junto al equipo municipal y otros actores locales, junto a la definición de los ejes temáticos a trabajar.
                    </li>
                    <li>
                        La identificación inicial de problemáticas y potencialidades, y el armado de iniciativas a desarrollar y monitorear dentro de una segunda instancia de diagnóstico operativo.
                    </li>
                    <li>
                        La planificación de acciones estratégicas a corto, mediano y largo plazo habiendo transitado las etapas anteriores.
                    </li>
                </Box>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El proceso puede incluir talleres con la comunidad, instancias de formación municipal, creación de material didáctico local, entre otras que culminan en un documento técnico final de planificación ambiental estratégica.
                </Typography>
                <Typography variant="h4" color="primary" sx={{ '&::before': { content: '"• "' } }}>Gestión Integral de Residuos Sólidos Urbanos (GIRSU)</Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El objetivo de esta línea es consolidar un sistema municipal de Gestión Integral de Residuos Sólidos Urbanos (GIRSU), que reduzca progresivamente lo destinado a disposición final promoviendo la inclusión social, minimizando los impactos ambientales y fortaleciendo las economías locales.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El CIEPA brinda asistencia técnica para la elaboración y presentación del Plan Básico Preliminar (PBP) y del Plan GIRSU municipal, conforme a lo establecido por la Ley provincial 13.592/06, así como de los programas asociados necesarios para su implementación. Además, acompaña la realización de espacios participativos y mesas de trabajo locales que fortalezcan la articulación entre el gobierno, las instituciones y la comunidad en la gestión de los residuos.
                </Typography>
                <Typography variant="h4" color="primary" sx={{ '&::before': { content: '"• "' } }}>Gestión y Planificación del Arbolado Urbano</Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Esta línea apunta a fortalecer la gestión del arbolado público como política ambiental estratégica, consolidando un sistema de gestión del arbolado que permita mejorar la calidad del entorno urbano, promover la biodiversidad y fortalecer el vínculo de la comunidad con su patrimonio natural.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Entre otras iniciativas, puede ofrecer:
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', '& li::before': { content: '"- "' }, px: 2, fontSize: '1rem' }}>
                    <li>
                        Censos de arbolado mediante herramientas digitales.
                    </li>
                    <li>
                        Capacitación de equipos municipales en poda, mantenimiento y manejo del arbolado.
                    </li>
                    <li>
                        Planificación de nuevas forestaciones, con un enfoque participativo y priorizando la plantación de especies nativas.
                    </li>
                </Box>
                <Typography variant="h4" color="primary" sx={{ '&::before': { content: '"• "' } }}>Plan Local de Acción Climática (PLAC)</Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El objetivo de esta línea es acompañar a los gobiernos locales en la formulación de su Plan Local de Acción Climática. Esta es una herramienta de planificación estratégica diseñada para optimizar la gestión de recursos técnicos y económicos, permitiendo la transición hacia un municipio resiliente y bajo en carbono.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El trabajo se estructura en dos fases principales, que combinan el diagnóstico con la planificación de acciones estratégicas:
                </Typography>
                <Box component="ul" sx={{ px: 2, fontSize: '1rem' }}>
                    <li>
                        <strong>Fase de Mitigación (Inventario GEI):</strong> Se realiza un inventario municipal de Gases de Efecto Invernadero (GEI) para identificar las principales fuentes de emisión. A partir de este diagnóstico, se definen metas claras de reducción y se proyectan acciones concretas para alcanzarlas, fomentando la transición energética local.
                    </li>
                    <li>
                        <strong>Fase de Adaptación (Plan de Respuesta):</strong> Se evalúan los riesgos climáticos específicos del territorio y la vulnerabilidad social asociada. Con base en este análisis, se definen objetivos para la prevención y se diseñan acciones de respuesta para fortalecer la resiliencia de la comunidad, la infraestructura y los ecosistemas locales ante casos extremos.
                    </li>
                </Box>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El proceso incluye el acompañamiento técnico del CIEPA en la creación de mesas de trabajo intersectoriales, talleres participativos y la redacción del documento técnico final del Plan.
                </Typography>
                <Typography variant="h4" color="primary" sx={{ '&::before': { content: '"• "' } }}>Cálculo y Gestión de la Huella de Carbono</Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Esta línea ofrece el servicio de cuantificación y análisis de la huella de carbono, un indicador clave para que las organizaciones, empresas y el propio gobierno local puedan comprender, medir y gestionar su impacto ambiental.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El objetivo es brindar una herramienta técnica que permita identificar las principales fuentes de emisión, establecer líneas base para futuros compromisos de mitigación y comunicar de manera transparente las acciones ambientales. Este servicio es un insumo fundamental para la planificación climática, reportes de sostenibilidad o certificaciones.
                </Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El servicio se adapta a distintas escalas tanto organizacional, como de productos y actividades puntuales. 
                </Typography>
                <Typography variant="h4" color="primary" sx={{ margin: 'auto', py: 2 }}>— Otras líneas complementarias —</Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    Además de las líneas principales, el CIEPA  ofrece acompañamiento técnico y metodológico en otras áreas que fortalecen la política ambiental local. Cada una puede desarrollarse mediante planes, programas o ciclos de formación que fortalezcan las capacidades locales y consoliden una gestión ambiental con identidad propia en cada municipio. 
                </Typography>
                <Box component="ul" sx={{ px: 2, fontSize: '1rem' }}>
                    <li>
                        <strong>Educación y comunicación ambiental</strong>
                    </li>
                    <li>
                        <strong>Biodiversidad y bienes comunes naturales</strong>
                    </li>
                    <li>
                        <strong>Alimentación y soberanía alimentaria</strong>
                    </li>
                </Box>
                <Typography variant="h4" color="primary" sx={{ margin: 'auto', py: 2 }}>— Modalidades de trabajo y acompañamiento técnico —</Typography>
                <Typography variant="body1" color="textPrimary" fontSize='1rem'>
                    El CIEPA trabaja en el marco de convenios generales y específicos con los municipios, bajo la estructura formal de la Facultad de Agronomía de la Universidad de Buenos Aires. Los equipos interdisciplinarios del CIEPA están integrados por profesionales y técnicos especializados en políticas ambientales, con el apoyo de la Secretaría de Desarrollo y Relaciones Institucionales de la FAUBA.
                </Typography>
            </Box>
        </SectionContainer>
    )
} 