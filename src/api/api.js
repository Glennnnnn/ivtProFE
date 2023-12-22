
import { http } from '@/utils';

export const customerList = async (searchingParams) => {
    console.log(searchingParams);
    var queryBody = {
        "pageOffset" : searchingParams.pagination.current,
        "pageSize" : searchingParams.pagination.pageSize,
        "delFlag" : "active",
        "order": searchingParams.order ?? "ascend"
    }
    const response = await http.post(`/queryCustomerData`, queryBody);
    return response.data;
}