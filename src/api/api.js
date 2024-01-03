
import { http } from '@/utils';

export const customerList = async (searchingParams) => {
    var queryBody = {
        "searchParams": searchingParams.searchName ?? "",
        "pageOffset": searchingParams.pagination.current ?? 1,
        "pageSize": searchingParams.pagination.pageSize ?? 10,
        "delFlag": searchingParams.filters?.delFlag ?? [],
        "order": searchingParams.order ?? "ascend"
    }
    const response = await http.post(`/queryCustomerData`, queryBody);
    return response.data;
}

export const searchCustomerList = async (searchName) => {
    var queryBody = {
        "searchParams": searchName,
        "pageOffset": 1,
        "pageSize": 30,
        "delFlag": ["active"],
        "order": "ascend"
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

export const getCustomerDetailById = async(customerId) => {
    const response = await http.get(`/queryCustomerDataById?customerId=${customerId}`);
    return response.data;
}

export const editCustomer = async (formData, customerId) => {
    var queryBody = {
        "customerId": customerId,
        "customerName": formData.customerName ?? "",
        "companyName": formData.companyName ?? "",
        "deliveryAddress": formData.customerDeliveryAddress ?? "",
        "billingAddress": formData.customerBillingAddress ?? "",
        "customerPhone": formData.customerPhone ?? "",
        "customerEmail": formData.customerEmail ?? "",
        "customerNote": formData.note ?? "",
        "creditTerm": formData.creditTerm,
        "delFlag": "active",
        "createTime": null,
        "updateTime": null,
    }
    const response = await http.post(`/updateCustomer`, queryBody);
    return response.data;
}

export const deleteCustomer = async(formData, customerId) => {
    var queryBody = {
        "customerId": customerId,
        "delNote": formData.reason ?? ""
    }
    const response = await http.delete(`/deleteCustomer`, { data: queryBody });
    return response.data;
} 

export const customersSummary = async () => {
    const response = await http.get(`/countCustomerByLabel`);
    return response.data;
}