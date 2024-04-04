import type { PageLoad } from './$types';
import { BASE_URL } from '$lib/api';
import type { ApiResponse, PaginatedPlatesList, Plate } from '$lib/types';

export const load: PageLoad = async ({ url, fetch }) => {
    const page = url.searchParams.get('page') || '1';

    const platesResponse = await fetch(`${BASE_URL}/plates?page=${page}`);
    if (platesResponse.status !== 200) {
        return emptyData();
    }

    const body = await platesResponse.json() as ApiResponse;
    if (!body.success) {
        return emptyData();
    }

    const payload = body.payload as PaginatedPlatesList;

    return {
        plates: payload.plates,
        total: payload.total,
        page: payload.page
    };
}

const emptyData = () : PaginatedPlatesList => {
    return {
        plates: [],
        page: 1,
        total: 0
    } as PaginatedPlatesList
}
