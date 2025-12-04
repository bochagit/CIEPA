import * as React from 'react';
import PropTypes from 'prop-types';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Pagination, CircularProgress, Alert, IconButton, styled, OutlinedInput, InputAdornment, FormControl, Typography, Grid, CardMedia, CardContent, Card, Box, Avatar } from '@mui/material';
import { brand } from '../../shared-theme/themePrimitives';
import { postService } from '../services/postService';
import { useNavigate } from 'react-router-dom';

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

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.default,
  transition: 'background-color .3s, transform .3s, border .3s',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.background.default,
    cursor: 'pointer',
    transform: 'scale(1.005)',
    border: `1px solid ${brand.main}`
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: (theme.vars || theme).palette.primary.main,
    outlineOffset: '2px',
  },
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

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

function Author({ authors, date }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          {authors?.[0]?.name?.charAt(0).toUpperCase() || 'A'}
        </Avatar>
        <Typography variant="caption">
          {authors?.map(author => author.name).join(', ') || 'Autor desconocido'}
        </Typography>
      </Box>
      <Typography variant="caption">
        {formatDateForDisplay(date)}
      </Typography>
    </Box>
  );
}

Author.propTypes = {
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
}

export function Search({ onSearch, searchTerm }) {
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm || '')

  const handleInputChange = (event) => {
    setLocalSearchTerm(event.target.value)
  }

  const executeSearch = () => {
    onSearch(localSearchTerm.trim())
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      executeSearch()
    }
  }

  React.useEffect(() => {
    setLocalSearchTerm(searchTerm || '')
  }, [searchTerm])

  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Buscar..."
        value={localSearchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <IconButton
              onClick={executeSearch}
              edge="start"
              size="small"
              sx={{ backgroundColor: 'transparent !important', border: 'none', '&:hover': { color: 'primary.main', backgroundColor: 'transparent' } }}
            >
              <SearchRoundedIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string
}

export default function Notas() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
  const [posts, setPosts] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalPosts, setTotalPosts] = React.useState(0)
  const [searchTerm, setSearchTerm] = React.useState('')
  const navigate = useNavigate()

  const postsPerPage = 4

  const fetchPosts = async (page = 1, search = '') => {
    try {
      setLoading(true)
      console.log('Obteniendo posts...', { page, search, limit: postsPerPage })

      const response = await postService.getAllPosts({
        page,
        limit: postsPerPage,
        search: search.trim(),
        status: 'published'
      })

      console.log('Posts obtenidos: ', response)

      setPosts(response.posts || [])
      setTotalPages(Math.ceil((response.total || 0) / postsPerPage))
      setTotalPosts(response.total || 0)
      setError('')
    } catch(error) {
      console.error('Error obteniendo posts: ', error)
      setError('Error al cargar las notas. Por favor, intente nuevamente.')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPosts(currentPage, searchTerm)
  }, [currentPage, searchTerm])

  const handleSearch = (search) => {
    setSearchTerm(search)
    setCurrentPage(1)
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardClick = (postId) => {
    navigate(`/notas/${postId}`)
  }

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const getPlainTextFromHtml = (html, maxLength = 150) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html || ''
    const text = tempDiv.textContent || tempDiv.innerText || ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SectionTitle variant="h3" component="h2">Notas</SectionTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SectionTitle variant="h3" component="h2">Notas</SectionTitle>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    )
  }

  if (posts.length === 0){
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SectionTitle variant="h3" component="h2">Notas</SectionTitle>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, width: '100%', justifyContent: 'space-between', alignItems: { xs: 'start', md: 'center' }, gap: 4 }}>
          <Search onSearch={handleSearch} searchTerm={searchTerm} />
        </Box>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          {searchTerm ? `No se encontraron notas que coincidan con "${searchTerm}"` : 'No hay notas publicadas todavía.'}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <SectionTitle variant="h3" component="h2">
          Notas {searchTerm && `- "${searchTerm}"`}
        </SectionTitle>
      </div>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          gap: 1,
          width: { xs: '100%', md: 'fit-content' },
          overflow: 'auto',
        }}
      >
        <Search onSearch={handleSearch} searchTerm={searchTerm} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: 1,
            width: { xs: '100%', md: 'fit-content' },
            overflow: 'auto',
          }}
        >
          <Search onSearch={handleSearch} searchTerm={searchTerm} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {searchTerm ? (
            `${posts.length} de ${totalPosts} resultados${searchTerm ? ` para "${searchTerm}"` : ''}`
          ) : (
            `${posts.length} de ${totalPosts} notas${totalPages > 1 ? ` (página ${currentPage} de ${totalPages})` : ''}`
          )}
        </Typography>
      </Box>
      <Grid container spacing={3} columns={12}>
        {posts.map((post, index) => (
          <Grid key={post._id} size={{ xs: 12, md: 6 }}>
            <StyledCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              onClick={() => handleCardClick(post._id)}
              tabIndex={0}
              className={focusedCardIndex === index ? 'Mui-focused' : ''}
              sx={{ 
                height: '100%',
                minHeight: '420px'
              }}
            >
              {post.coverImage ? (
                <CardMedia
                  component="img"
                  alt={post.title}
                  image={post.coverImage}
                  sx={{
                    height: '240px',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: '240px',
                    backgroundColor: 'primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'grey.500',
                  }}
                >
                  <Typography variant="h5" color="inherit">
                    {post.category}
                  </Typography>
                </Box>
              )}

              <StyledCardContent>
                <Typography gutterBottom variant="caption" component="div" color="primary">
                  {post.category}
                </Typography>
                <Typography gutterBottom variant="h6" component="div" sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '3em' }}>
                  {post.title}
                </Typography>
                <StyledTypography variant="body2" color="text.secondary" gutterBottom sx={{ WebkitLineClamp: 3, minHeight: '4.5em', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {post.summary || getPlainTextFromHtml(post.content)}
                </StyledTypography>
              </StyledCardContent>
                <Author authors={post.authors} date={post.date} />
              </StyledCard>
            </Grid>
        ))}
        </Grid>
        {totalPages && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              />
          </Box>
        )}
    </Box>
  )
}
