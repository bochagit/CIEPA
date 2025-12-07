import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import categoryRoutes from './routes/category.routes.js'
import youtubeRoutes from './routes/youtube.routes.js'
import eventRoutes from './routes/event.routes.js'
import reportRoutes from './routes/report.routes.js'
import searchRoutes from './routes/search.routes.js'

const app = express()

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ciepa.onrender.com',
        'http://ciepa.agro.uba.ar',
        'https://ciepa.agro.uba.ar'

    ],
    credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan("dev"))

app.use("/auth", authRoutes)
app.use("/posts", postRoutes)
app.use("/upload", uploadRoutes)
app.use("/categories", categoryRoutes)
app.use("/youtube", youtubeRoutes)
app.use("/eventos", eventRoutes)
app.use('/reports', reportRoutes)
app.use('/search', searchRoutes)

export default app