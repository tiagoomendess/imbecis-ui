import type { PageLoad } from './$types';
import { getReportsList } from '$lib/reportsApi';

export const ssr = false

export const load: PageLoad = async ({ url }) => {
    const page = url.searchParams.get('page') || '1'
    const status = url.searchParams.get('status') || ''
    const municipality = url.searchParams.get('municipality') || ''
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    const response = await getReportsList({
        page: parseInt(page),
        status: status,
        municipality: municipality,
        sortOrder: sortOrder
    })
    

    return { 
        reports: response.payload?.reports || [],
        page: response.payload?.page || 1,
        total: response.payload?.total || 0,
        filters: {
            status: status,
            municipality: municipality,
            sortOrder: sortOrder
        }
    };
}
