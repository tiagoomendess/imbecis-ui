import axios from 'axios'
import type { Report, Coordinates, VoteRequest } from '$lib/types'
import { location } from '$lib/stores/location'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

export const createReport = async (): Promise<string | null> => {
    const body = {
        location: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        }
    }

    const uuid = getDeviceUUID()

    try {
        const response = await axios.post(`${BASE_URL}/reports`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        })

        if (response.status !== 201 || !response.data.success) {
            return null
        }

        return response.data.payload.id
    } catch (error) {
        console.error("Creating report: ", error)
        return null
    }
}

export const uploadPicture = async (reportId: string, picture: Blob): Promise<boolean> => {

    const uuid = getDeviceUUID()
    const formData = new FormData()
    formData.append('picture', picture)

    try {
        const response = await axios.post(`${BASE_URL}/reports/${reportId}/upload-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        })

        if (response.status !== 201 || !response.data.success) {
            return false
        }

        return true
    } catch (error) {
        console.error("Error uploading picture: ", error)
        return false
    }
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

        return response.data.payload as Report
    } catch (error) {
        console.error("Getting report for review: ", error)
        return null
    }
}

export const submitReportVote = async (reportId: string, request : VoteRequest): Promise<boolean> => {
    try {
        const uuid = getDeviceUUID()
        const response = await axios.post(`${BASE_URL}/reports/${reportId}/vote`, request, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid,
            }
        })

        if (response.status !== 201 || !response.data.success) {
            console.error("Error submitting report vote: ", response.data)
            return false
        }
    } catch (error) {
        console.error("Error submitting report review: ", error)
        return false
    }

    return true
}
