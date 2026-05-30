import axios from 'axios'
import type { Report, Coordinates, VoteRequest, Plate, PaginatedPlatesList, ReporterInfo } from '$lib/types'
import { location } from '$lib/stores/location'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

let csrfToken = ""
let coordinates = { latitude: 0, longitude: 0 } as Coordinates

function setCsrfToken(token: string) {
    csrfToken = token;
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('csrfToken', token);
        sessionStorage.setItem('csrfTokenSetAt', String(Date.now()));
    }
}

function getCsrfToken(): string {
    if (csrfToken) return csrfToken;
    if (typeof sessionStorage !== 'undefined') {
        const stored = sessionStorage.getItem('csrfToken');
        const storedAt = parseInt(sessionStorage.getItem('csrfTokenSetAt') ?? '0');
        if (stored && Date.now() - storedAt < 9 * 60 * 1000) {
            csrfToken = stored;
            return csrfToken;
        }
    }
    return '';
}
location.subscribe((value: Coordinates) => {
    coordinates = value
})

export const getDeviceUUID = (): string => {
    if (typeof localStorage === 'undefined') {
        return ""
    }

    return localStorage.getItem('deviceUUID') || ""
}

export const getFeed = async (page: number = 1, municipality: string = ""): Promise<Report[]> => {
    try {
        let url = `${BASE_URL}/reports/feed?page=${page}`
        if (municipality) {
            url += `&municipality=${municipality}`
        }

        const response = await axios.get(url)

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

export const createReport = async (
    imageHash : string,
    reporterInfo : ReporterInfo | null,
    sendReporterInfo = false,
    occurredAt: Date = new Date(),
): Promise<CreateReportResponse> => {
    const body = {
        imageHash: imageHash,
        occurredAt: occurredAt.toISOString(),
        location: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        }
    } as any

    if (reporterInfo !== null && sendReporterInfo) {
        body.reporterInfo = reporterInfo
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

        setCsrfToken(response.headers['csrf-token'] || "")

        toReturn.reportId = response.data.payload.id
        toReturn.success = true
        toReturn.message = "Report criado com sucesso"
    } catch (error: any) {
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
                'csrf-token': getCsrfToken()
            }
        })

        if (response.status !== 201 || !response.data.success) {
            toReturn.message = response.data.message || `Pedido falhou com status ${response.status}`
            return toReturn
        }

        toReturn.success = true
        toReturn.message = "Imagem submetida com sucesso"
    } catch (error: any) {
        console.error("Error uploading picture: ", error)
        if (error.response) {
            toReturn.message = error.response.data.message || "Erro desconhecido";
        } else {
            toReturn.message = "Não obteve resposta do servidor";
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

        setCsrfToken(response.headers['csrf-token'] || "")

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

export const submitReportVote = async (reportId: string, request: VoteRequest): Promise<SubmitReportVoteResponse> => {
    try {
        const uuid = getDeviceUUID()
        const response = await axios.post(`${BASE_URL}/reports/${reportId}/vote`, request, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid,
                'csrf-token': getCsrfToken(),
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

    } catch (error: any) {
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
    } catch (error) {
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
    } catch (error: any) {
        console.error("Error getting plates of confirmed imbeciles: ", error)

        if (error.response) {
            toReturn.message = error.response.data.message ?? "Erro desconhecido"
        }

        return toReturn
    }
}

export interface MyReport {
    id: string
    picture: string | null
    pdf: string | null
    status: string
    municipality: string | null
    occurredAt: string
}

export interface PaginatedMyReports {
    reports: MyReport[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export const getMyReports = async (page: number = 1, pageSize: number = 10): Promise<PaginatedMyReports> => {
    const empty: PaginatedMyReports = { reports: [], page: 1, pageSize: 10, total: 0, totalPages: 0 }

    const uuid = getDeviceUUID()
    if (!uuid) return empty

    try {
        const response = await axios.get(`${BASE_URL}/reports/mine`, {
            params: { page, pageSize },
            headers: {
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        })

        if (response.status !== 200 || !response.data.success) {
            return empty
        }

        const meta = response.data.meta
        return {
            reports: response.data.payload as MyReport[],
            page: meta.page,
            pageSize: meta.pageSize,
            total: meta.total,
            totalPages: meta.totalPages
        }
    } catch (error) {
        console.error("Error getting my reports: ", error)
        return empty
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
    } catch (error: any) {
        console.error("Error uploading picture: ", error)
        if (error.response) {
            toReturn.message = error.response.data.message ?? "Erro desconhecido"
        }
    }

    return toReturn
}

export const getMe = async (): Promise<{ isAdmin: boolean }> => {
    try {
        const response = await axios.get(`${BASE_URL}/users/me`, {
            headers: { 'device-uuid': getDeviceUUID() }
        })
        if (response.status !== 200 || !response.data.success) return { isAdmin: false }
        return response.data.payload
    } catch {
        return { isAdmin: false }
    }
}

export interface GeoInfo {
    rua: string | null;
    n_porta: number | null;
    CP: string | null;
    freguesia: string | null;
    concelho: string | null;
}

export interface ReportDetail {
    id: string;
    status: string;
    occurredAt: string;
    createdAt: string;
    picture: string | null;
    pdf: string | null;
    municipality: string | null;
    location: { latitude: number; longitude: number };
    geoInfo: GeoInfo | null;
    plate: { country: string; number: string } | null;
    editable: boolean;
    validMunicipalities: string[];
}

export interface PatchReportPayload {
    location?: { latitude: number; longitude: number };
    municipality?: string;
    rua?: string;
    n_porta?: number | null;
    CP?: string;
    freguesia?: string;
    plateCountry?: string;
    plateNumber?: string;
    lock_report?: boolean;
}

export interface UpdateMyReportResult {
    detail: ReportDetail | null;
    error: string | null;
    csrfExpired: boolean;
}

export const getMyReportDetail = async (reportId: string): Promise<ReportDetail | null> => {
    const uuid = getDeviceUUID();
    if (!uuid) return null;

    try {
        const response = await axios.get(`${BASE_URL}/reports/mine/${reportId}`, {
            headers: {
                'Accept': 'application/json',
                'device-uuid': uuid
            }
        });

        if (response.status !== 200 || !response.data.success) return null;

        return response.data.payload as ReportDetail;
    } catch (error) {
        console.error("Error getting report detail: ", error);
        return null;
    }
}

const CSRF_ERROR_MESSAGES = ['Código de segurança não encontrado', 'Código de segurança inválido'];

// CSRF tokens are only minted by POST /reports and GET /reports/for-review.
// Opening the report detail page directly leaves us without one, so fetch a
// report for review purely to obtain a fresh token before mutating.
const ensureCsrfToken = async (): Promise<boolean> => {
    if (getCsrfToken()) return true;
    await getReportForReview();
    return getCsrfToken() !== '';
}

const sendUpdateMyReport = async (
    reportId: string,
    payload: PatchReportPayload,
    uuid: string
): Promise<UpdateMyReportResult> => {
    try {
        const response = await axios.patch(`${BASE_URL}/reports/mine/${reportId}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'device-uuid': uuid,
                'csrf-token': getCsrfToken()
            }
        });

        if (response.status !== 200 || !response.data.success) {
            return { detail: null, error: response.data.message ?? 'Erro desconhecido', csrfExpired: false };
        }

        return { detail: response.data.payload as ReportDetail, error: null, csrfExpired: false };
    } catch (error: any) {
        console.error("Error updating report: ", error);
        if (error.response) {
            const errors: string[] = error.response.data?.errors ?? [];
            const message: string = error.response.data?.message ?? '';
            const allMessages = [...errors, message].filter(Boolean);
            const csrfExpired = allMessages.some(m => CSRF_ERROR_MESSAGES.includes(m));
            return { detail: null, error: allMessages[0] ?? 'Erro desconhecido', csrfExpired };
        }
        return { detail: null, error: 'Sem resposta do servidor', csrfExpired: false };
    }
}

export const updateMyReport = async (
    reportId: string,
    payload: PatchReportPayload
): Promise<UpdateMyReportResult> => {
    const uuid = getDeviceUUID();
    if (!uuid) return { detail: null, error: 'Dispositivo não identificado', csrfExpired: false };

    await ensureCsrfToken();

    let result = await sendUpdateMyReport(reportId, payload, uuid);

    // If the token was missing or stale, mint a fresh one and retry once.
    if (result.csrfExpired) {
        csrfToken = "";
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('csrfToken');
            sessionStorage.removeItem('csrfTokenSetAt');
        }
        const refreshed = await ensureCsrfToken();
        if (refreshed) {
            result = await sendUpdateMyReport(reportId, payload, uuid);
        }
    }

    return result;
}
