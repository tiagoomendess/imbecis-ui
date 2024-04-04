import type { PageLoad } from './$types';
import type { ApiResponse } from '$lib/types';
import { BASE_URL } from '$lib/api';

export const load: PageLoad = async ({ fetch }) => {
    const apiResponse = await fetch(`${BASE_URL}/reports/feed?page=1`);
    if (apiResponse.status !== 200) {
        return emptyResponse();
    }

    const body = await apiResponse.json() as ApiResponse;
    if (!body.success) {
        return emptyResponse();
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
