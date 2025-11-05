const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export const getYouTubeVideos = async (req, res) => {
    try {
        const limit = req.query.limit || 8

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=${limit}&type=video`
        )

        if (!response.ok){
            throw new Error('Error al obtener videos de YouTube')
        }

        const data = await response.json()

        const videos = data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            thumbnailHigh: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
        }))

        res.json({ videos, total: data.pageInfo.totalResults })
    } catch(error) {
        console.error('Error fetching YouTube videos: ', error)
        res.status(500).json({
            message: 'Error al obtener videos de YouTube',
            error: error.message
        })
    }
}

export const getChannelInfo = async (req, res) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${YOUTUBE_CHANNEL_ID}&part=snippet,statistics`
        )

        if (!response.ok){
            throw new Error('Error al obtener información del canal')
        }

        const data = await response.json()
        const channel = data.items[0]

        const channelInfo = {
            id: channel.id,
            title: channel.snippet.title,
            description: channel.snippet.description,
            thumbnail: channel.snippet.thumbnails.medium.url,
            subscriberCount: channel.statistics.subscriberCount,
            videoCount: channel.statistics.videoCount,
            viewCount: channel.statistics.viewCount,
            url: `https://www.youtube.com/channel/${channel.id}`
        }

        res.json(channelInfo)
    } catch(error) {
        console.error('Error fetching channel info: ', error)
        res.status(500).json({
            message: 'Error al obtener información del canal',
            error: error.message
        })
    }
}