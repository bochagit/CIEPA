import api from "./api";

export const reportService = {
    async createReport(reportData){
        console.log('Creando informe: ', reportData.title)
        const response = await api.post('/reports', reportData)
        return response.data
    },

    async getAllReports(params = {}){
        const { page = 1, limit = 12, search = '' } = params
        console.log('Obteniendo informes: ', { page, limit, search })

        const response = await api.get('/reports', {
            params: { page, limit, search }
        })
        return response.data
    },

    async getReportById(id){
        console.log('Obteniendo informe: ', id)
        const response = await api.get(`/reports/${id}`)
        return response.data.report
    },

    async updateReport(id, reportData){
        console.log('Actualizando informe: ', id)
        const response = await api.put(`/reports/${id}`, reportData)
        return response.data
    },

    async deleteReport(id){
        console.log('Eliminando informe: ', id)
        const response = await api.delete(`/reports/${id}`)
        return response.data
    },

    async incrementDownloads(id){
        const response = await api.patch(`/reports/${id}/download`)
        return response.data
    }
}