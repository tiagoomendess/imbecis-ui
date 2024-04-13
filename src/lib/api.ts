import axios from 'axios'
import type { Report, Coordinates, VoteRequest, Plate, PaginatedPlatesList } from '$lib/types'
import { location } from '$lib/stores/location'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

let csrfToken = ""
let coordinates = { latitude: 0, longitude: 0 } as Coordinates
location.subscribe((value : Coordinates) => {
    coordinates = value
})

const getDeviceUUID = (): string => {
    if (typeof localStorage === 'undefined') {
        return ""
    }

    return localStorage.getItem('deviceUUID') || ""
}

export const getFeed = async (page: number = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/reports/feed?page=${page}`)

        if (response.status !== 200 || !response.data.success) {
            return []
        }

        return response.data.payload
    } catch (error) {
        console.error("Error getting feed: ", error)
        return []
    }
}

export interface CreateReportResponse {
    success: boolean
    message: string
    reportId: string
}

export const createReport = async (): Promise<CreateReportResponse> => {
    const body = {
        location: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        }
    }

    const uuid = getDeviceUUID()

    let toReturn = {
        success: false,
        message: "Erro desconhecido",
        reportId: ""
    }

    try {
        const response = await axios.post(`${BASE_URL}/reports`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        })

        if (response.status !== 201 || !response.data.success) {
            toReturn.message = response.data.message ?? `Pedido falhou com status ${response.status}`
            return toReturn
        }

        csrfToken = response.headers['csrf-token'] || ""

        toReturn.reportId = response.data.payload.id
        toReturn.success = true
        toReturn.message = "Report criado com sucesso"
    } catch (error : any) {
        if (error.response) {
            toReturn.message = error.response.data.message ?? "Erro desconhecido"
        }
    }

    return toReturn
}

export interface UploadPictureResponse {
    success: boolean
    message: string
}

export const uploadPicture = async (reportId: string, picture: Blob): Promise<UploadPictureResponse> => {
    const uuid = getDeviceUUID()
    const formData = new FormData()
    formData.append('picture', picture)

    let toReturn = {
        success: false,
        message: "Erro desconhecido"
    }

    try {
        const response = await axios.post(`${BASE_URL}/reports/${reportId}/upload-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'device-uuid': uuid,
                'csrf-token': csrfToken
            }
        })

        if (response.status !== 201 || !response.data.success) {
            toReturn.message = response.data.message ?? `Pedido falhou com status ${response.status}`
            return toReturn
        }

        toReturn.success = true
        toReturn.message = "Imagem submetida com sucesso"
    } catch (error : any) {
        console.error("Error uploading picture: ", error)
        if (error.response) {
            toReturn.message = error.response.data.message ?? "Erro desconhecido"
        }
    }

    return toReturn
}

export const getReportForReview = async (): Promise<Report | null> => {
    try {
        const uuid = getDeviceUUID()
        const response = await axios.get(`${BASE_URL}/reports/for-review`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        })

        if (response.status !== 200 || !response.data.success) {
            return null
        }

        csrfToken = response.headers['csrf-token'] || ""

        const report = response.data.payload as Report

        return report
    } catch (error) {
        console.error("Getting report for review: ", error)
        return null
    }
}

export interface SubmitReportVoteResponse {
    success: boolean
    message: string
}

export const submitReportVote = async (reportId: string, request : VoteRequest): Promise<SubmitReportVoteResponse> => {
    try {
        const uuid = getDeviceUUID()
        const response = await axios.post(`${BASE_URL}/reports/${reportId}/vote`, request, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid,
                'csrf-token': csrfToken,
            }
        })

        if (response.status !== 201 || !response.data.success) {
            console.error("Error submitting report vote: ", response.data)
            return {
                success: false,
                message: response.data.message ?? "Erro desconhecido"
            }
        }

        return {
            success: true,
            message: "Voto submetido com sucesso"
        }

    } catch (error : any) {
        console.error("Error submitting report vote: ", error)
        if (error.response) {
            const customMessage = error.response.status === 429 ? 'Está a votar muito rápido' : "Erro desconhecido"
            return {
                success: false,
                message: error.response.data.message ?? customMessage
            }
        } else {
            return {
                success: false,
                message: "Erro desconhecido"
            }
        }
    }
}

export const getPlateByCountryAndNumber = async (country: string, number: string): Promise<Plate | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/plates/${country}/${number}`)

        if (!response.data.success) {
            return null
        }

        return response.data.payload as Plate
    } catch (error) {
        console.error("Error getting plate by country and number: ", error)
        return null
    }
}

export const getPlateReports = async (plateId: string): Promise<Report[] | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/plates/${plateId}/reports`)

        if (!response.data.success) {
            return null
        }

        return response.data.payload as Report[]
    } catch(error) {
        console.error("Error getting plate reports: ", error)
        return null
    }
}

export const getPlatesOfConfirmedImbeciles = async (page: number = 1): Promise<PaginatedPlatesList> => {
    try {
        const response = await axios.get(`${BASE_URL}/plates?page=${page}`)

        if (!response.data.success) {
            return {
                plates: [],
                page: 1,
                total: 0
            }
        }

        return response.data.payload as PaginatedPlatesList
    } catch (error) {
        console.error("Error getting plates of confirmed imbeciles: ", error)
        return {
            plates: [],
            page: 1,
            total: 0
        }
    }
}

export const countAvailableReportsForReview = async (): Promise<number> => {
    try {
        const response = await axios.get(`${BASE_URL}/reports/for-review/count`, {
            headers: {
                'device-uuid': getDeviceUUID()
            }
        })

        if (!response.data.success) {
            return 0
        }

        return response.data.payload.count as number
    } catch (error) {
        console.error("Error counting available reports for review: ", error)
        return 0
    }
}

export interface GetReportByIdResponse {
    success: boolean
    message: string
    report: Report | null
}

export const getReportById = async (id: string): Promise<GetReportByIdResponse> => {
    let toReturn = {
        success: false,
        message: "Erro desconhecido",
        report: null
    } as GetReportByIdResponse

    try {
        const response = await axios.get(`${BASE_URL}/reports/${id}`)

        if (!response.data.success) {
            toReturn.message = response.data.message ?? "Erro desconhecido"
            return toReturn
        }

        toReturn.success = true
        toReturn.message = "Report encontrado"
        toReturn.report = response.data.payload as Report

        return toReturn
    } catch (error : any) {
        console.error("Error getting plates of confirmed imbeciles: ", error)
    
        if (error.response) {
            toReturn.message = error.response.data.message ?? "Erro desconhecido"
        }

        return toReturn
    }
}

export interface UpdateReportPictureResponse {
    success: boolean
    message: string
}

export const updateReportPicture = async (reportId: string, picture: Blob): Promise<UpdateReportPictureResponse> => {
    const uuid = getDeviceUUID()
    const formData = new FormData()
    formData.append('picture', picture)

    let toReturn = {
        success: false,
        message: "Erro desconhecido"
    } as UpdateReportPictureResponse

    try {
        const response = await axios.post(`${BASE_URL}/reports/${reportId}/update-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        })

        if (response.status !== 201 || !response.data.success) {
            toReturn.message = response.data.message ?? `Pedido falhou com status ${response.status}`
            return toReturn
        }

        toReturn.success = true
        toReturn.message = "Imagem alterada com sucesso"
    } catch (error : any) {
        console.error("Error uploading picture: ", error)
        if (error.response) {
            toReturn.message = error.response.data.message ?? "Erro desconhecido"
        }
    }

    return toReturn
}
