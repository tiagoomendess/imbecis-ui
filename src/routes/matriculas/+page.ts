import type { PageLoad } from './$types';
import { getPlatesOfConfirmedImbeciles } from '$lib/api';

export const load: PageLoad = async ({ url }) => {
    const page = url.searchParams.get('page') || '1';

    const platesResponse = await getPlatesOfConfirmedImbeciles(parseInt(page))

    return {
        platesResponse
    };
}
