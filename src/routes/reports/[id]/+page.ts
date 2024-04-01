import type { PageLoad } from './$types';
import { getReportById } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
    const id = params.id as string

    const report = await getReportById(id)

    return report;
}
