
import { http } from '@/utils';

export const customerList = async (searchingParams) => {
    console.log(searchingParams);
    const response = await http.post(`/queryCustomerData`, {});
    return response.data;
}