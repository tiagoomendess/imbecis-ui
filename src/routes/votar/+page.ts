import type { PageLoad } from './$types';
import { getReportForReview } from '$lib/api';

export const ssr = false

export const load: PageLoad = async () => {
    const reportForReview = await getReportForReview()

    return {
        loaded: true,
        reportForReview: reportForReview
    };
}
