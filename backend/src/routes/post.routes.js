import express from 'express'
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/post.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.post("/", verifyToken, createPost)
router.put("/:id", verifyToken, updatePost)
router.delete("/:id", verifyToken, deletePost)

export default router