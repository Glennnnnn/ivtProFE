
import { http } from '@/utils';

export const customerList = async (searchingParams) => {
    var queryBody = {
        "pageOffset": searchingParams.pagination.current,
        "pageSize": searchingParams.pagination.pageSize,
        "delFlag": searchingParams.filters?.delFlag ?? [],
        "order": searchingParams.order ?? "ascend"
    }
    const response = await http.post(`/queryCustomerData`, queryBody);
    return response.data;
}

export const addCustomer = async (formData) => {
    var deliveryAddress = "";
    var billingAddress = ""
    if (formData.enableAddress === true){
        deliveryAddress = formData.customerDeliveryAddress
        if(formData.enableBilling === true){
            billingAddress = formData.customerDeliveryAddress
        }
        else{
            billingAddress = formData.customerBillingAddress
        }
    }

    var queryBody = {
        "customerName": formData.customerName ?? "",
        "companyName": formData.companyName,
        "deliveryAddress": deliveryAddress,
        "billingAddress": billingAddress,
        "customerPhone": formData.customerPhone ?? "",
        "customerEmail": formData.customerEmail ?? "",
        "customerNote": formData.note ?? "",
        "creditTerm": formData.creditTerm,
        "delFlag": "active",
        "createTime": null,
        "updateTime": null,
    }

    const response = await http.post(`/insertNewCustomer`, queryBody);
    return response.data;
}

export const customersSummary = async () => {
    const response = await http.get(`/countCustomerByLabel`);
    return response.data;
}