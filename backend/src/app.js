import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import categoryRoutes from './routes/category.routes.js'
import youtubeRoutes from './routes/youtube.routes.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/youtube", youtubeRoutes)

export default app