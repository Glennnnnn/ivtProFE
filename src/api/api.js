
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
    if (formData.enableAddress === true) {
        deliveryAddress = formData.customerDeliveryAddress
        if (formData.enableBilling === true) {
            billingAddress = formData.customerDeliveryAddress
        }
        else {
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

export const getCustomerDetailById = async (customerId) => {
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

export const deleteCustomer = async (formData, customerId) => {
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

export const searchProductList = async (searchName, filterDel = null) => {
    var queryBody = {
        "searchParas": {
            "searchInfo": searchName,
            "pageIndex": 1,
            "pageSize": 30,
            ...(filterDel !== null && { "filterDel": filterDel })
        }
    };

    const response = await http.post(`/ivt/queryIvtResultByInfo`, queryBody);
    return response.data;
}

export const orderList = async (searchingParams) => {
    //console.log(searchingParams);
    var queryBody = {
        "searchParams": searchingParams.searchName ?? "",
        "pageIndex": searchingParams.pagination.current ?? 1,
        "pageSize": searchingParams.pagination.pageSize ?? 10,
        "orderStatus": searchingParams.filters?.orderStatus ?? [],
        "field": searchingParams.field === undefined ? "orderDate" : searchingParams.order === undefined ? "orderDate" : searchingParams.field,
        "order": searchingParams.order === undefined ? "desc" : searchingParams.order === "ascend" ? "asc" : "desc"
    }
    const response = await http.post(`/queryOrderData`, queryBody);
    return response.data;
}

export const orderListWithPx = async (searchingParams, orderType = 1) => {
    var queryBody = {
        "searchParams": searchingParams.searchName ?? "",
        "pageIndex": searchingParams.pagination.current ?? 1,
        "pageSize": searchingParams.pagination.pageSize ?? 20,
        "orderStatus": searchingParams.filters?.orderStatus ?? [],
        "field": searchingParams.field === undefined ? "orderId" : searchingParams.order === undefined ? "orderId" : searchingParams.field,
        "order": searchingParams.order === undefined ? "desc" : searchingParams.order === "ascend" ? "asc" : "desc",
        "orderType" : orderType
    }
    //console.log(queryBody);
    const response = await http.post(`/queryOrderDataWithPx`, queryBody);
    return response.data;
}


export const addOrder = async (queryBody) => {
    const response = await http.post(`/insertNewOrder`, queryBody);
    return response.data;
}

export const getOrderDetailByDBId = async (orderDBId) => {
    const response = await http.get(`/queryOrderDataById?orderDBId=${orderDBId}`);
    return response.data;
}

export const ordersDataByCustomerId = async (searchingParams, customerId) => {
    var queryBody = {
        "searchParams": "",
        "pageIndex": searchingParams.pagination.current ?? 1,
        "pageSize": searchingParams.pagination.pageSize ?? 10,
        "orderStatus": searchingParams.filters?.orderStatus ?? [],
        "field": "orderDate",
        "order": "desc",
        "customerId": customerId
    }
    const response = await http.post(`/queryOrderData`, queryBody);
    return response.data;
}

export const getOrderSummary = async () => {
    const response = await http.get(`/queryOrderCountData`);
    return response.data;
}

export const updateOrderStatus = async (orderDBId, orderStatus, reverseReason) => {
    var queryBody = {
        "orderDBId": orderDBId,
        "orderStatus": orderStatus,
        "reverseReason": reverseReason,
    }
    const response = await http.post(`/updateOrderStatus`, queryBody);
    return response.data;
}

export const editOrderById = async (queryBody) => {
    const response = await http.post(`/updateOrderById`, queryBody);
    return response.data;
}

export const deleteOrderById = async (orderDBId) => {
    const response = await http.delete(`/deleteOrderById?orderDBId=${orderDBId}`);
    return response.data;
}

export const editOrderStatusByIds = async (orderDBIdList, orderStatus) => {
    var queryBody = {
        "orderDBIds": orderDBIdList,
        "orderStatus": orderStatus
    }
    const response = await http.post(`/batchUpdateOrderStatus`, queryBody);
    return response.data;
}

export const deleteOrderByIds = async (orderDBIdList) => {
    var queryBody = {
        "orderDBIds": orderDBIdList,
    }
    const response = await http.post(`/batchDeleteOrder`, queryBody);
    return response.data;
}

export const addRestock = async (queryBody) => {
    const response = await http.post(`/insertStockBatchData`, queryBody);
    return response.data;
}

export const queryRestockById = async (restockDBId) => {
    var queryBody = {
        "stockBatchDBId": restockDBId,
    }
    const response = await http.post(`/queryStockBatchById`, queryBody);
    return response.data;
}

export const restockList = async (searchingParams) => {
    var queryBody = {
        "stockBatchId": searchingParams.searchName ?? "",
        "pageIndex": searchingParams.pagination.current ?? 1,
        "pageSize": searchingParams.pagination.pageSize ?? 10,
        "order": searchingParams.order ?? ""
    }
    const response = await http.post(`/queryStockBatchData`, queryBody);
    return response.data;
}

export const queryCashSaleOrderId = async () => {
    const response = await http.get(`/queryAutoGenerateOrderId`);
    return response.data;
}

export const queryOrderDataByIdList = async (orderDBIdList) => {
    var queryBody = {
        "orderDBIdList": orderDBIdList,
    }
    const response = await http.post(`/queryOrderDataByIdList`, queryBody);
    return response.data;
}

export const addCompany = async (formData) => {
    var queryBody = {
        "companyName": formData.companyName,
        "companyPhone": formData.companyPhone,
        "companyEmail": formData.companyEmail,
    }
    const response = await http.post(`/company/insertNewCompany`, queryBody);
    return response.data;
}

export const queryCompanyList = async (searchParams) => {
    var queryBody = {
        "searchParam": searchParams.searchName ?? "",
        "pageOffset": searchParams.pagination.current ?? 1,
        "pageSize": searchParams.pagination.pageSize ?? 20
    }
    console.log(queryBody);
    const response = await http.post(`/company/queryCompanyList`, queryBody);
    return response.data;
}

export const searchCompanyList = async (searchName) => {
    var queryBody = {
        "searchParam": searchName,
        "pageOffset": 1,
        "pageSize": 30,
        "delFlag": ["active"],
    }
    const response = await http.post(`/company/queryCompanyList`, queryBody);
    return response.data;
}