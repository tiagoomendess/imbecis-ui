import type { PageLoad } from './$types';
import { getMyReports, getDeviceUUID } from '$lib/api';
import { goto } from '$app/navigation';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
    const rawPage = parseInt(url.searchParams.get('page') ?? '1');
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const uuid = getDeviceUUID();
    if (!uuid) {
        return { reports: [], page: 1, pageSize: 10, total: 0, totalPages: 0, noDevice: true };
    }

    const data = await getMyReports(page);

    if (data.total > 0 && page > data.totalPages) {
        await goto('?page=1', { replaceState: true });
        return { ...data, page: 1 };
    }

    return { ...data, noDevice: false };
};
