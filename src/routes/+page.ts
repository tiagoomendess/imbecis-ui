import type { PageLoad } from './$types';
import type { ApiResponse } from '$lib/types';
import { BASE_URL } from '$lib/api';
import { MUNICIPALITIES } from '$lib/utils/constants';

export const load: PageLoad = async ({ fetch, url }) => {
    let municipality = decodeURI(url.searchParams.get('municipio') || "")
    const page = url.searchParams.get('page') || 1

    let fetchUrl = `${BASE_URL}/reports/feed?page=${page}`
    if (municipality && MUNICIPALITIES.includes(municipality)) {
        fetchUrl = `${fetchUrl}&municipality=${municipality}`
    }

    const apiResponse = await fetch(fetchUrl);
    if (apiResponse.status !== 200) {
        console.error('Failed to load reports', apiResponse.status);
        return emptyResponse();
    }

    const body = await apiResponse.json() as ApiResponse
    if (!body.success) {
        return emptyResponse()
    }

    return {
        reports: body.payload
    };
}

const emptyResponse = () => {
    return {
        reports: []	
    }
}
