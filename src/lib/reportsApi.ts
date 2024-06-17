import axios from "axios"
import type { ApiBaseResponse } from "./regionsApi";
import { getDeviceUUID } from "./api";
import { showNotification } from "./utils/notifications";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface PlateInList {
    country: string
    number: string
}

export interface ReportInList {
    id: string
    status: string
    municipality?: string
    originalPicture?: string
    publicPicture?: string
    suggestedPlate?: PlateInList
    confirmedPlate?: PlateInList
    notSureVotes: number
    imbecileVotes: number
    createdAt: Date
    updatedAt: Date
}

export interface ListReportsResponse {
    total: number
    page: number
    reports: ReportInList[]
}

export interface ListReportsRequest {
    page: number
    status?: string
    municipality?: string
    sortOrder?: string
}

export const getReportsList = async (request: ListReportsRequest): Promise<ApiBaseResponse<ListReportsResponse>> => {
    const uuid = getDeviceUUID()

    const params = {} as any
    if (request.page) {
        params.page = request.page
    }

    if (request.status) {
        params.status = request.status
    }

    if (request.municipality) {
        params.municipality = request.municipality
    }

    if (request.sortOrder) {
        params.sortOrder = request.sortOrder
    }

    try {
        const response = await axios.get(`${BASE_URL}/reports`, {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        })

        return response.data as ApiBaseResponse<ListReportsResponse>
    } catch (error: any) {
        let message = "Erro Desconhecido a obter lista de denúncias"
        if (error.response) {
            message = error.response.data.message || "Erro Desconhecido"
        }

        return {
            success: false,
            message: message,
            payload: null
        }
    }
}

// Only these fields can be updated
export interface ReportInListUpdateRequest {
    reportId: string
    status: string
    plateCountry?: string
    plateNumber?: string
}

export const updateReport = async (request : ReportInListUpdateRequest): Promise<boolean> => {
    const uuid = getDeviceUUID()
    try {
        const response = await axios.patch(`${BASE_URL}/reports/${request.reportId}`, {
            status: request.status,
            plateCountry: request.plateCountry,
            plateNumber: request.plateNumber
        }, {
            headers: {
                'device-uuid': uuid,
            }
        })

        showNotification(response.data.message, "success")

        return response.data.success
    } catch (error: any) {
        console.error("Error updating report: ", error)
        let errorMessage = "Erro desconhecido"
        if (error.response) {
            errorMessage = error.response.data.message || `Pedido retornou HTTP ${error.response.status}`
        }

        showNotification(errorMessage, "error")

        return false
    }
}

export const deleteReport = async (reportId: string): Promise<boolean> => {
    const uuid = getDeviceUUID()
    try {
        const response = await axios.delete(`${BASE_URL}/reports/${reportId}`, {
            headers: {
                'device-uuid': uuid,
            }
        })

        showNotification(response.data.message, "success")

        return response.data.success
    } catch (error: any) {
        console.error("Error deleting report: ", error)
        let errorMessage = "Erro desconhecido"
        if (error.response) {
            errorMessage = error.response.data.message || `Pedido retornou HTTP ${error.response.status}`
        }

        showNotification(errorMessage, "error")

        return false
    }
}
