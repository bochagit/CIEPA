import api from "./api"

export const postService = {
    getAllPosts: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams()

            if (params.page) queryParams.append('page', params.page)
            if (params.limit) queryParams.append('limit', params.limit)
            if (params.search) queryParams.append('search', params.search)
            if (params.status) queryParams.append('status', params.status)
            if (params.category) queryParams.append('category', params.category)
            if (params.featured !== undefined) queryParams.append('featured', params.featured)

            const queryString = queryParams.toString()
            const url = queryString ? `/posts?${queryString}` : '/posts'

            console.log('Fetching posts: ', url)

            const response = await api.get(url)
            return response.data
        } catch(error) {
            console.error('Error fetching posts: ', error)
            throw new Error(error.response?.data?.message || 'Error al obtener los posts')
        }
    },

    getPostById: async (id) => {
        const response = await api.get(`/posts/${id}`)
        return response.data
    },

    createPost: async (postData) => {
        const response = await api.post('/posts', postData)
        return response.data
    },

    updatePost: async (id, postData) => {
        const response = await api.put(`/posts/${id}`, postData)
        return response.data
    },

    deletePost: async (id) => {
        const response = await api.delete(`/posts/${id}`)
        return response.data
    }
}