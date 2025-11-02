import api from './api'

export const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await api.get('/categories')
            return response.data
        } catch(error) {
            throw new Error(error.response?.data?.message || "Error al obtener las categorías")
        }
    },

    getCategoryById: async (id) => {
        try {
            const response = await api.get(`/categories/${id}`)
            return response.data
        } catch(error) {
            throw new Error(error.response?.data?.message || "Error al obtener la categoría")
        }
    },

    createCategory: async (categoryData) => {
        try {
            const response = await api.post('/categories', categoryData)
            return response.data
        } catch(error) {
            throw new Error(error.response?.data?.message || "Error al crear la categoría")
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const response = await api.put(`/categories/${id}`, categoryData)
            return response.data
        } catch(error) {
            throw new Error(error.response?.data?.message || "Error al actualizar la categoría")
        }
    },

    deleteCategory: async(id) => {
        try {
            const response = await api.delete(`/categories/${id}`)
            return response.data
        } catch(error) {
            throw new Error(error.response?.data?.message || "Error al eliminar la categoría")
        }
    }
}