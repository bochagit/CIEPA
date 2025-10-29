import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403){
            const token = localStorage.getItem('token');
            const currentPath = window.location.pathname;

            if (token && currentPath !== '/signin'){
                console.log('Sesión expirada, redirigiendo...');
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/signin'
            }
        }
        return Promise.reject(error)
    }
)

export default api