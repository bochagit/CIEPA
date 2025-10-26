import express from 'express'
import { getPosts, getPostsById, createPost, updatePost, deletePost } from '../controllers/post.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get("/", getPosts)
router.get("/:id", getPostsById)
router.post("/", verifyToken, createPost)
router.put("/:id", verifyToken, updatePost)
router.delete("/:id", verifyToken, deletePost)

export default router