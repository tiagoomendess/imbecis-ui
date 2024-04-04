
export interface User {
    uuid: string
}

export interface Report {
    id: string
    status: string
    deviceUUID: string
    municipality: string
    picture: string
    updatedAt: string
    createdAt: string
}

export interface Coordinates {
    latitude: number
    longitude: number
}

export interface VoteRequest {
    plateNumber: string
    plateCountry: string
    result: string
}

export interface Plate {
    id : string
    country: string
    number: string
}

export interface PaginatedPlatesList {
    plates: Plate[]
    page: number
    total: number
}

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface ApiResponse {
    success: boolean
    message: string
    payload: any
}
