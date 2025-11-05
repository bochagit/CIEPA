import { Router } from 'express'
import { getYouTubeVideos, getChannelInfo } from '../controllers/youtube.controller.js'

const router = Router()

router.get('/videos', getYouTubeVideos)
router.get('/channel', getChannelInfo)

export default router