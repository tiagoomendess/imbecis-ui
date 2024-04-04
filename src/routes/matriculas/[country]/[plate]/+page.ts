import type { PageLoad } from './$types';
import type { Plate, Report, ApiResponse } from '$lib/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const load: PageLoad = async ({ params, fetch }) => {
    const plateResponse = await fetch(`${BASE_URL}/plates/${params.country}/${params.plate}`)
    if (plateResponse.status !== 200) {
        return defaultResponse()
    }

    let body = await plateResponse.json() as ApiResponse
    if (!body.success) {
        return defaultResponse()
    }

    const plate = body.payload as Plate

    // Same but for reports now
    const reportsRes = await fetch(`${BASE_URL}/plates/${plate.id}/reports`)
    if (reportsRes.status !== 200) {
        return {
            plate: plate,
            reports: []
        }
    }

    body = await reportsRes.json() as ApiResponse
    if (!body.success) {
        return {
            plate: plate,
            reports: []
        };
    }

    const reports = body.payload as Report[]

    return {
        plate: plate,
        reports: reports
    };
}

const defaultResponse = () => {
    return {
        plate: null,
        reports: []
    }
}
