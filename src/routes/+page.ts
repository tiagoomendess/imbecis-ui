import type { PageLoad } from './$types';
import { getFeed } from '$lib/api';

export const load: PageLoad = async () => {

    const reports = await getFeed(1)

    return {
        reports: reports
    };
}
