import type { PageLoad } from './$types';
import type { HeatCoordinate } from '$lib/types';
import { BASE_URL } from '$lib/api';

export const ssr = false;

export const load: PageLoad = async () => {
    const response = await fetch(`${BASE_URL}/reports/heat-map`);
    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    const coordinates: HeatCoordinate[] = jsonResponse.payload?.coordinates || [];

    return {
        coordinates
    };
};
