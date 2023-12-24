
import { http } from '@/utils';

export const customerList = async (searchingParams) => {
    var queryBody = {
        "pageOffset" : searchingParams.pagination.current,
        "pageSize" : searchingParams.pagination.pageSize,
        "delFlag" : searchingParams.filters?.delFlag ?? [],
        "order": searchingParams.order ?? "ascend"
    }
    const response = await http.post(`/queryCustomerData`, queryBody);
    return response.data;
}

export const customersSummary = async () => {
    const response = await http.get(`/countCustomerByLabel`);
    return response.data;
}