import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Chip, Avatar, Divider, IconButton, CircularProgress, Alert, Container, Button, styled } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { brand } from '../../shared-theme/themePrimitives'
import { postService } from '../services/postService'

const HeaderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '450px',
  width: '100vw',
  marginLeft: 'calc(50% - 50vw)',
  marginRight: 'calc(50% - 50vw)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundAttachment: 'scroll',
  borderRadius: 0,
  marginBottom: theme.spacing(4),
  overflow: 'hidden',
  maxWidth: '100vw',
  boxSizing: 'border-box',
  [theme.breakpoints.up('md')]: {
    backgroundAttachment: 'fixed'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.5))',
    zIndex: 1
  }
}));

const HeaderContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  textAlign: 'center',
  padding: '3rem 2rem',
  maxWidth: '800px',
  margin: '0 auto'
});

const ContentContainer = styled(Container)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(0, 2)
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 30,
  left: 30,
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.text.primary,
  backdropFilter: 'blur(10px)',
  transition: 'background-color .2s, transform .2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.05)'
  }
}));

const MetaInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2)
  }
}));

const AuthorInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const DateInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary
}));

const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''

    console.log('Fecha original en lista: ', dateString)
    try {
      if (typeof dateString === 'string' && dateString.includes('T')){
        const dateOnly = dateString.split('T')[0]
        const [year, month, day] = dateOnly.split('-')
        const formatted = `${day}/${month}/${year}`
        console.log('Fecha formateada para mostrar: ', formatted)
        return formatted
      }

      if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)){
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
      }

      if (dateString instanceof Date){
        const day = String(dateString.getDate()).padStart(2, '0')
        const month = String(dateString.getMonth() + 1).padStart(2, '0')
        const year = dateString.getFullYear();
        return `${day}/${month}/${year}`
      }

      return dateString
    } catch(error) {
      console.warn('Error formateando fecha: ', error)
      return dateString
    }
}

export default function Note(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                console.log('Obteniendo post con ID: ', id)

                const response = await postService.getPostById(id)
                console.log('Post obtenido: ', response)

                setPost(response)
                setError('')
            } catch(error) {
                console.error('Error obteniendo psot: ', error)
                setError('Error al cargar la nota.')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchPost()
        }
    }, [id])

    const handleBack = () => {
        navigate('/notas')
    }

    React.useEffect(() => {
        if (post){
            document.title = `${post.title} | CIEPA`

            const metaDescription = document.querySelector('meta[name=description]')
            if(metaDescription && post.summary){
                metaDescription.setAttribute('content', post.summary)
            }
        }

        return () => {
            document.title = 'CIEPA'
        }
    }, [post])

    if (loading){
        return (
            <ContentContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} />
                </Box>
            </ContentContainer>
        )
    }

    if (error || !post){
        return (
            <ContentContainer>
                <Box sx={{ py: 8 }}>
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error || 'Nota no encontrada'}
                    </Alert>
                    <Button variant="contained" onClick={handleBack} startIcon={<ArrowBackIcon />}>
                        Volver a notas
                    </Button>
                </Box>
            </ContentContainer>
        )
    }

    return (
        <Box>
            <HeaderContainer sx={{ backgroundImage: post.coverImage ? `url(${post.coverImage})` : 'none', backgroundColor: post.coverImage ? 'transparent' : 'primary.main' }}>
                <BackButton onClick={handleBack}>
                    <ArrowBackIcon sx={{ color: 'primary.main' }} />
                </BackButton>

                <HeaderContent>
                    <Chip label={post.category} sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, .9)', color: 'text.primary', fontWeight: 600 }} />
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                        {post.title}
                    </Typography>
                    {post.summary && (
                        <Typography variant="h6" sx={{ opacity: .9, fontWeight: 400 }}>
                            {post.summary}
                        </Typography>
                    )}
                </HeaderContent>
            </HeaderContainer>

            <ContentContainer>
                <MetaInfo>
                    <AuthorInfo>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: brand.main }}>
                            {post.author?.charAt(0).toUpperCase() || 'A'}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Escrito por
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {post.author || 'Autor desconocido'}
                            </Typography>
                        </Box>
                    </AuthorInfo>
                    <DateInfo>
                        <CalendarTodayIcon fontSize="small" />
                        <Typography variant="body2">
                            {formatDateForDisplay(post.date)}
                        </Typography>
                    </DateInfo>

                    {post.featured && (
                        <Chip
                            label="Destacada"
                            color="primary"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                </MetaInfo>

                <Divider sx={{ mb: 4 }} />

                <Box
                    className="ql-editor"
                    sx={{
                    border: 'none !important',
                    padding: '0 !important',
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    '& p': { margin: '0 0 1em 0' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                        fontWeight: 'normal',
                        margin: '1em 0 0.5em 0'
                    },
                    '& ul, & ol': {paddingLeft: '1.5em'},
                    '& blockquote': {
                        borderLeft: '4px solid #ccc',
                        margin: '1em 0',
                        paddingLeft: '1em',
                        fontStyle: 'italic'
                    },
                    '& img': {maxWidth: '100%', height: 'auto'},
                    '& a': {
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': {textDecoration: 'underline'}
                    }
                    }}
                    dangerouslySetInnerHTML={{__html: post.content}} 
                />

                <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />} size="large" >
                        Volver a todas las notas
                    </Button>
                </Box>
            </ContentContainer>
        </Box>
    )
}