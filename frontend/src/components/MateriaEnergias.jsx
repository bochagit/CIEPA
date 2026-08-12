import * as React from 'react'
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Stack,
    Typography,
    alpha,
    styled,
} from '@mui/material'
import { brand } from '../../shared-theme/themePrimitives'
import {
    CheckCircle as CheckCircleIcon,
    LocationOn as LocationOnIcon,
    OpenInNew as OpenInNewIcon,
    Schedule as ScheduleIcon,
    School as SchoolIcon,
} from '@mui/icons-material'
import materiaImage from '../assets/images/static-photos/Materia1.jpeg'

const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4),
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
    },
}))

const BlockTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: brand.main,
    position: 'relative',
    paddingBottom: theme.spacing(1.5),
    '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: 56,
        height: 3,
        borderRadius: 999,
        backgroundColor: brand.main,
    },
}))

const HeroImage = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    minHeight: 420,
    borderRadius: theme.spacing(2.5),
    overflow: 'hidden',
    border: `1px solid ${alpha(brand.main, 0.1)}`,
    boxShadow: theme.shadows[3],
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
}))

const Pill = styled(Chip)(({ theme }) => ({
    borderRadius: 999,
    height: 32,
    fontWeight: 600,
    borderColor: alpha(brand.main, 0.35),
    color: (theme.vars ?? theme).palette.text.secondary,
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
}))

const QuickFactsBox = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    border: `1px solid ${alpha(brand.main, 0.1)}`,
    backgroundColor: alpha(brand.main, 0.05),
    padding: theme.spacing(2.5, 3),
}))

const ContentGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
}))

const BlockList = styled(Box)(({ theme }) => ({
    margin: 0,
    padding: 0,
    listStyle: 'disc',
    listStylePosition: 'inside',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
}))

const BlockListItem = styled(Box)(({ theme }) => ({
    margin: 0,
    padding: 0,
    fontSize: '1rem',
    lineHeight: 1.7,
    color: (theme.vars ?? theme).palette.text.secondary,
}))

const BlockLink = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: brand.main,
    textDecoration: 'underline',
    textUnderlineOffset: 4,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'color 0.2s ease-in-out',
    '&:hover': {
        color: brand.variant,
    },
}))

const factItems = [
    { label: 'Carga horaria', value: '48 horas', icon: ScheduleIcon },
    { label: 'Modalidad', value: 'Presencial', icon: LocationOnIcon },
    { label: 'Estado', value: 'Inscripción abierta', icon: CheckCircleIcon },
]

const infoBlocks = [
    {
        title: 'Destinatarios del curso y requisitos de admisión',
        content: [
            {
                type: 'text',
                value:
                    'Estudiantes avanzados y/o egresados de carreras de grado y tecnicaturas de la Facultad de Agronomía (UBA), así como de carreras afines a las ciencias agrarias, biológicas o ambientales de universidades públicas o privadas. También podrán postularse estudiantes avanzados, egresados y/o profesionales de otras disciplinas con interés o experiencia profesional en energía y transición energética. En estos casos deberán presentar CV y carta de motivación para su evaluación.'
            },
        ],
    },
    {
        title: 'Contenidos del curso',
        content: [
            {
                type: 'text',
                value:
                    'Energía y Cambio Climático. Drivers de los procesos de transición energética. Energías convencionales. Recursos hidrocarburíferos convencionales y no convencionales. Energías limpias y renovables. Tecnologías renovables disponibles. Transporte y distribución de la energía. Generación y tecnología de almacenamiento. Movilidad sustentable y planificación. Estrategias para descarbonizar el transporte. Economía de la energía. Mercados energéticos. Derecho y política de la energía. Marcos regulatorios nacionales y provinciales. Eficiencia energética. Uso racional y eficiente de la energía. Transición energética. Políticas públicas para la Transición Energética. Experiencias en LATAM, nacionales y subnacionales.',
            },
        ],
    },
    {
        title: 'Características generales',
        content: [
            {
                type: 'list',
                items: [
                    'Carga horaria total: 48 h',
                    'Modalidad de cursada: Presencial',
                    'Certificados FAUBA',
                    'Arancelado',
                    'Becas: se otorgarán becas a quienes las necesiten',
                    'Incluye viaje de estudios'
                ],
            },
        ],
    },
    {
        title: 'Cursadas',
        content: [
            {
                type: 'list',
                heading: 'Datos de la cursada',
                items: [
                    'Inicio de la cursada: 10/08/2026',
                    'Fin de la cursada: 28/11/2026',
                    'Horarios: Jueves 18 a 21 hs',
                ],
            },
        ],
    },
    {
        title: 'Resoluciones y materiales',
        content: [
            {
                type: 'link',
                label: 'Resolución de aprobación',
                href:
                    'https://cursos-diplomaturas.agro.uba.ar/storage/approval_resolutions/qUjdMQ5izFWVyVXxbxgrAa0wDJTJlqYRPefgHq9I.pdf',
            },
            {
                type: 'list',
                heading: 'Contacto',
                items: [
                    {
                        label: 'Correo electrónico:',
                        value: 'ciepa@agro.uba.ar',
                        href: 'mailto:ciepa@agro.uba.ar',
                    },
                ],
            },
        ],
    },
    {
        title: 'Equipo docente',
        content: [
            {
                type: 'text',
                value: 'Docentes invitados especialistas en la temática.'
            }
        ],
    },
]

function BlockContent({ content }) {
    return (
        <Stack spacing={2.5}>
            {content.map((item, index) => {
                if (item.type === 'text') {
                    return (
                        <Typography
                            key={index}
                            variant="body1"
                            sx={{ color: 'text.secondary', lineHeight: 1.8, textAlign: 'justify' }}
                        >
                            {item.value}
                        </Typography>
                    )
                }

                if (item.type === 'list') {
                    return (
                        <Box key={index}>
                            {item.heading && (
                                <h3>{item.heading}</h3>
                            )}
                            <BlockList component="ul">
                                {item.items.map((entry, i) => (
                                    <BlockListItem component="li" key={i}>
                                        {typeof entry === 'string' ? (
                                            entry
                                        ) : (
                                            <>
                                                <Box component="span" sx={{ fontWeight: 600 }}>
                                                    {entry.label}{' '}
                                                </Box>
                                                {entry.href ? (
                                                    <BlockLink
                                                        component="a"
                                                        href={entry.href}
                                                        target={entry.href.startsWith('http') ? '_blank' : undefined}
                                                        rel={entry.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                    >
                                                        {entry.value}
                                                    </BlockLink>
                                                ) : (
                                                    entry.value
                                                )}
                                            </>
                                        )}
                                    </BlockListItem>
                                ))}
                            </BlockList>
                        </Box>
                    )
                }

                if (item.type === 'link') {
                    return (
                        <Box key={index}>
                            <BlockLink component="a" href={item.href} target="_blank" rel="noopener noreferrer">
                                {item.label}
                                <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
                            </BlockLink>
                        </Box>
                    )
                }

                return null
            })}
        </Stack>
    )
}

export default function MateriaEnergias() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                    gap: { xs: 4, md: 8 },
                    mb: 5,
                }}
            >
                <Box sx={{ width: { xs: '100%', md: '40%' }, flexShrink: 0 }}>
                    <HeroImage component="figure" sx={{ m: 0 }}>
                        <img src={materiaImage} alt="Energía y transición energética" />
                    </HeroImage>
                </Box>

                <Box
                    sx={{
                        width: { xs: '100%', md: '60%' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Chip
                        label="Curso de capacitación"
                        color="primary"
                        variant="outlined"
                        sx={{ width: 'fit-content', fontWeight: 600, mb: 2 }}
                    />

                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            lineHeight: 1.05,
                            fontSize: { xs: '2.1rem', sm: '2.5rem', md: '2.8rem' },
                            maxWidth: 720,
                            mb: 2,
                        }}
                    >
                        Energía y Transición Energética
                    </Typography>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2.5, flexWrap: 'wrap' }}>
                        <Pill label="Inscripción abierta" color="success" variant="outlined" />
                        <Pill label="Segundo cuatrimestre 2026" variant="outlined" />
                        <Pill label="Modalidad presencial" variant="outlined" />
                    </Stack>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            lineHeight: 1.85,
                            textAlign: 'justify',
                            maxWidth: 760,
                            mb: 3.5,
                        }}
                    >
                        El curso propone un abordaje integral del sector energético y los procesos de transición energética, considerando sus dimensiones técnicas, ambientales, socioeconómicas y políticas. Se analizan las fuentes y matrices energéticas, la generación, transporte y distribución, la eficiencia, movilidad sustentable, mercados y marcos regulatorios, así como las políticas e instrumentos de gestión. Se incorporan las dimensiones de acceso, vulnerabilidad y transición justa, con especial atención al contexto argentino, y en diálogo con experiencias regionales e internacionales (costo: 2 cuotas de 125.000)
                    </Typography>

                    <QuickFactsBox
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                            gap: 2,
                        }}
                    >
                        {factItems.map(({ label, value, icon: Icon }) => (
                            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 38,
                                        height: 38,
                                        borderRadius: 999,
                                        flexShrink: 0,
                                        backgroundColor: alpha(brand.main, 0.1),
                                        color: brand.main,
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ display: 'block', fontWeight: 600, color: 'text.secondary', lineHeight: 1.2 }}
                                    >
                                        {label}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {value}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </QuickFactsBox>
                </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <SectionTitle variant="h3" component="h2" sx={{ mb: 8 }}>
                Sobre la formación
            </SectionTitle>

            <ContentGrid sx={{ mb: 5 }}>
                {infoBlocks.map((block) => (
                    <Box key={block.title}>
                        <BlockTitle variant="h5" component="h3" sx={{ mb: 1.5 }}>
                            {block.title}
                        </BlockTitle>
                        <BlockContent content={block.content} />
                    </Box>
                ))}
            </ContentGrid>

            <Divider sx={{ my: 4 }} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 1.5,
                    py: 2,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    ¿Te gustaría inscribirte?
                </Typography>
                <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ justifyContent: 'center', mt: 1.5 }}>
                    <Button variant="contained" color="primary" size="large" href="https://cursos-diplomaturas.agro.uba.ar/info/270" target="_blank">
                        Inscribirme
                    </Button>
                </Stack>
            </Box>
        </Container>
    )
}
