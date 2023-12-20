
const apiUrl = 'http://3.25.98.192:8081';

const fetchOptions = (method, body) => ({
    method,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});

export const customerList = async(searchingParams) => {
    console.log(searchingParams);
    const response = await fetch(`${apiUrl}/queryCustomerData`, fetchOptions('POST', {}));
    const data = await response.json();
    return data;
}