import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getMyReportDetail, getDeviceUUID } from '$lib/api';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
    const uuid = getDeviceUUID();
    if (!uuid) {
        error(403, 'Dispositivo não identificado');
    }

    const detail = await getMyReportDetail(params.reportId);
    if (!detail) {
        error(404, 'Denúncia não encontrada');
    }

    return { detail };
};
