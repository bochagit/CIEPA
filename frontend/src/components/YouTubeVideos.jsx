import * as React from 'react'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Skeleton,
    Alert,
    Button,
    Avatar,
    Chip
} from '@mui/material'
import {
    PlayArrow as PlayIcon,
    YouTube as YouTubeIcon,
    OpenInNew as OpenIcon,
    Visibility as ViewIcon,
    ThumbUp as LikeIcon
} from '@mui/icons-material'
import { youtubeService } from '../services/youtubeService'

const YouTubeVideos = ({ maxVideos = 6 }) => {
    const [videos, setVideos] = React.useState([])
    const [channelInfo, setChannelInfo] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const [videosData, channelData] = await Promise.allSettled([
                    youtubeService.getVideos(maxVideos),
                    youtubeService.getChannelInfo()
                ])

                if (videosData.status === 'fulfilled'){
                    setVideos(videosData.value.videos || [])
                }

                if (channelData.status === 'fulfilled'){
                    setChannelInfo(channelData.value)
                }
            } catch(error) {
                setError('Error al cargar videos de YouTube')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [maxVideos])

    const VideoCard = ({ video }) => (
        <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnail}
                    alt={video.title}
                />
                <IconButton
                    component="a"
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(255, 0, 0, .9) !important',
                        color: '#fff',
                        width: 60,
                        height: 60,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 1) !important',
                            transform: 'translate(-50%, -50%) scale(1.1)'
                        },
                        transition: 'all .3s ease'
                    }}
                >
                    <PlayIcon sx={{ fontSize: 30 }} />
                </IconButton>
            </Box>
            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '3em'
                    }}
                >
                    {video.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {new Date(video.publishedAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Typography>
            </CardContent>
        </Card>
    )

    if (error){
        return(
            <Alert severity="error" sx={{ mb: 4 }}>
                {error}
            </Alert>
        )
    }

    return (
        <Box sx={{ backgroundColor: 'background.paper', border: '1px solid #f00', borderRadius: 1, p: 2 }}>
            {channelInfo && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2, backgroundColor: 'transparent' }}>
                        <YouTubeIcon sx={{ fontSize: 30, color: '#f00' }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Nuestros videos
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip icon={<ViewIcon />} label={`${parseInt(channelInfo.subscriberCount).toLocaleString()} suscriptores`} size="small" color="primary" />
                            <Chip icon={<PlayIcon />} label={`${channelInfo.videoCount} videos`} size="small" color="secondary" />
                        </Box>
                    </Box>
                    <Button variant="contained" startIcon={<YouTubeIcon />} href={channelInfo.url} target="_blank" rel="noopener noreferrer" sx={{ backgroundColor: '#f00 !important', '&:hover': {backgroundColor: '#e60000'} }}>
                        Ver canal
                    </Button>
                </Box>
            )}

            <Grid container spacing={3}>
                {loading ? (
                    Array(maxVideos).fill().map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Card>
                                <Skeleton variant="rectangular" height={200} />
                                <CardContent>
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" width="60%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    videos.map((video) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
                            <VideoCard video={video} />
                        </Grid>
                    ))
                )}
            </Grid>

            {videos.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <YouTubeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No hay videos disponibles
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default YouTubeVideos