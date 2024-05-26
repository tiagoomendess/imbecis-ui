import axios from 'axios'
import { BASE_URL, getDeviceUUID } from './api'

export interface ApiBaseResponse<T> {
    success: boolean
    message: string
    payload: T | null
}

export interface Polygon {
    type: "Polygon";
    coordinates: number[][][]
}

export interface NotificationRecipient {
    type: "email" | "reddit" | "none"
    target: string
}

export interface NotificationRegion {
    id: string
    name: string
    priority: number
    color: string
    polygon: Polygon;
    recipients: NotificationRecipient[]
}

export const createRegion = async (
    name: string,
    priority: number,
    color: string,
    polygon: Polygon,
    recipients: NotificationRecipient[],
): Promise<ApiBaseResponse<NotificationRegion>> => {
    try {
        const uuid = getDeviceUUID()
        const response = await axios.post(`${BASE_URL}/regions`, {
            name: name,
            priority: priority,
            color: color,
            polygon: polygon,
            recipients: recipients,
        }, {
            headers: {
                'device-uuid': uuid,
            }
        })

        return response.data as ApiBaseResponse<NotificationRegion>
    } catch (error: any) {
        console.error("Error creating region: ", error)

        let message = "Erro Desconhecido"
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

export const updateRegion = async (
    region: NotificationRegion,
): Promise<boolean> => {
    try {
        const uuid = getDeviceUUID()
        const response = await axios.put(`${BASE_URL}/regions/${region.id}`, {
            name: region.name,
            priority: region.priority,
            color: region.color,
            polygon: region.polygon,
            recipients: region.recipients,
        }, {
            headers: {
                'device-uuid': uuid,
            }
        })

        return response.data.success
    } catch (error) {
        console.error("Error updating region: ", error)
        return false
    }
}

export const getAllRegions = async (): Promise<ApiBaseResponse<NotificationRegion[]>> => {
    try {
        const response = await axios.get(`${BASE_URL}/regions`)

        return response.data
    } catch (error: any) {
        console.error("Error getting all regions: ", error)
        let message = "Erro Desconhecido"
        if (error.response) {
            message = error.response.data.message || "Erro Desconhecido"
        }
        return {
            success: false,
            message: message,
            payload: []
        }
    }
}

export const deleteRegion = async (regionId: string): Promise<ApiBaseResponse<boolean>> => {
    try {
        const uuid = getDeviceUUID()
        const response = await axios.delete(`${BASE_URL}/regions/${regionId}`, {
            headers: {
                'device-uuid': uuid,
            }
        })

        return response.data
    } catch (error : any) {
        console.error("Error deleting region: ", error)
        let message = "Erro Desconhecido"
        if (error.response) {
            message = error.response.data.message || "Erro Desconhecido"
        }
        
        return {
            message: message,
            success: false,
            payload: false
        }
    }
}
