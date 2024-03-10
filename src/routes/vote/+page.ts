import type { PageLoad } from './$types';
import { getReportForReview } from '$lib/api';

export const ssr = false

export const load: PageLoad = async () => {

    const reportForReview = await getReportForReview()
    // wait 1 second
    await new Promise(r => setTimeout(r, 1000))

    return {
        loaded: true,
        reportForReview: reportForReview
    };
}
