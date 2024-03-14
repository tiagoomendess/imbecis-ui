import type { PageLoad } from './$types';
import { getPlateReports, getPlateByCountryAndNumber } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
    const plate = await getPlateByCountryAndNumber(params.country, params.plate)
    if (!plate) {
        return {
            plate: null,
            reports: []
        };
    }

    const reports = await getPlateReports(plate.id)

    return {
        plate: plate,
        reports: reports
    };
}
