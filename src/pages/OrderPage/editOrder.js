import React, { useState, useEffect } from "react"
import "./index.scss"
import {
    Layout,
    Breadcrumb,
    Button,
    message,
    Card,
    Row,
    Col,
    Input,
    DatePicker,
    Select,
    Table,
    InputNumber,
    Form,
    Tag,
    Switch
} from 'antd';
import {
    PlusOutlined, LeftOutlined, DeleteOutlined, SaveOutlined
} from '@ant-design/icons'
import moment from "moment";
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { searchProductList, getOrderDetailByDBId, editOrderById, searchCustomerList, getCustomerDetailById } from "@/api/api.js";

const { Option } = Select;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    form,
    onDataChange,
    onSearchChange,
    onSelectChange,
    productList,
    ...restProps
}) => {
    const isNumberInput = inputType === 'number';

    const handleInputChange = (value) => {
        onDataChange(record.rowNo, dataIndex, value);
    };

    const handleSearchChange = (value) => {
        onSearchChange(value);
    }

    const handleSelectChange = (value) => {
        const selectedProduct = productList.find(product => product.ivtId.toString() === value);
        onSelectChange(record.rowNo, selectedProduct);
    }

    const inputNode =
        inputType === 'select' ? (
            <Select
                showSearch
                onSearch={handleSearchChange}
                onChange={handleSelectChange}
                placeholder="Search for product"
                optionLabelProp="label"
                defaultActiveFirstOption={false}
                filterOption={false}
                style={{ width: '100%' }}>
                {productList.map((product) => (
                    <Option key={product.ivtId.toString()}
                        value={product.ivtId.toString()}
                        label={product.ivtClassName.toString() + " " + product.tags.map((tag) => {
                            return (
                                tag.tagName + ':' + tag.tagValue
                            );
                        })}>
                        <div>{`${product.ivtClassName} - ${product.ivtSubclassCode}`}</div>
                        <span style={{ whiteSpace: 'pre-wrap' }}>
                            {product.delFlag === 1 &&
                                <Tag color={'black'}>
                                    Unavailable
                                </Tag>
                            }
                            {product.ivtQty <= product.lowStockAlertAmount &&
                                <Tag color={'red'} key={product.ivtId}>
                                    Low Stock
                                </Tag>
                            }
                            {product.tags.map((tag) => {
                                let color = tag.tagName.length > 5 ? 'geekblue' : 'green';
                                if (tag.tagName === 'color') {
                                    color = tag.tagValue;
                                }
                                return (
                                    <Tag color={color} key={tag.tagName}>
                                        {tag.tagName + ': ' + tag.tagValue}
                                    </Tag>
                                );
                            })}
                        </span>
                    </Option>
                ))}
            </Select>
        ) : isNumberInput ? (
            <InputNumber onChange={handleInputChange} placeholder="0" />
        ) : (
            <Input onChange={(e) => handleInputChange(e.target.value)} />
        );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={`${dataIndex}_${record.key}`}
                    style={{ margin: 0, }}>
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const EditOrderPage = () => {
    const { Content } = Layout;
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [orderDetail, setOrderDetail] = useState({});
    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState(dayjs());
    const [customerOrderNo, setCustomerOrderNo] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [isCashSale, setIsCashSale] = useState();
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);

    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const [productTotal, setProductTotal] = useState(0.00);
    const [productDiscount, setProductDiscount] = useState(0.00);
    const [shippingFee, setShippingFee] = useState(0.00);
    const [prevBalance, setPrevBalance] = useState(0.00);
    const [allTotal, setAllTotal] = useState(0.00);
    const [tax, setTax] = useState("");

    const taxList = [
        "Include", "Exclude", "No Tax"
    ]

    const [form] = Form.useForm();
    const [customerForm] = Form.useForm();

    const [data, setData] = useState([]);

    const columns = [
        {
            title: '#',
            dataIndex: 'rowNo',
            width: '5%',
            key: 'rowNo'
        },
        {
            title: 'Product',
            dataIndex: 'product',
            width: '35%',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '10%',
            editable: true,
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
            width: '10%',
            editable: true,
        },
        {
            title: 'Price(AUD)',
            dataIndex: 'price',
            width: '10%',
            editable: true,
        },
        {
            title: 'Discount(%)',
            dataIndex: 'discount',
            width: '10%',
            editable: true,
        },
        {
            title: 'Total(AUD)',
            dataIndex: 'total',
            width: '10%',
            render: (_, record) => {
                const formattedTotal = record.total.toFixed(2);
                return ` ${formattedTotal}`;
            },
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) => {
                return (
                    <span>
                        <Button type="danger" icon={<PlusOutlined />} onClick={() => handleAddRow(record)} style={{ marginRight: 8 }} />
                        <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} />
                    </span>
                );
            },
        },
    ];

    const handleAddRow = (key) => {
        const newRow = {
            rowNo: data.length + 1,
            product: '',
            description: '',
            qty: 0,
            price: 0,
            discount: 0,
            total: 0,
            key: new Date().getTime(),
        };

        setData((prevData) => {
            const updatedData = [
                ...prevData.slice(0, key.rowNo),
                newRow,
                ...prevData.slice(key.rowNo),
            ];
            const updatedDataWithRowNo = updatedData.map((row, index) => ({
                ...row,
                rowNo: index + 1,
            }));
            return updatedDataWithRowNo;
        });
    };

    const handleDeleteRow = (key) => {
        if (data.length !== 1) {
            const updatedData = data.filter((item) => item.rowNo !== key.rowNo);
            const updatedDataWithRowNo = updatedData.map((row, index) => ({
                ...row,
                rowNo: index + 1,
            }));
            setData(updatedDataWithRowNo);
        }
        else {
            form.resetFields();

            setData([{
                rowNo: 1,
                product: '',
                description: '',
                qty: 0,
                price: 0,
                discount: 0,
                total: 0,
                key: 1,
            }])
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const urlParams = new URLSearchParams(window.location.search);
                const orderDBId = urlParams.get('orderDBId');

                const posts = await getOrderDetailByDBId(orderDBId);
                if (posts.code === 200) {
                    setOrderId(posts.data.orderId);
                    setOrderDate(dayjs(posts.data.orderDate));
                    setCustomerOrderNo(posts.data.customerOrderNo);
                    setOrderNote(posts.data.orderNote);
                    setIsCashSale(posts.data.isCashSale);

                    setProductTotal(parseFloat(posts.data.orderSubTotal));
                    setProductDiscount(parseFloat(posts.data.orderDiscount ?? 0));
                    setShippingFee(parseFloat(posts.data.orderShippingFee ?? 0));
                    setPrevBalance(parseFloat(posts.data.orderPreBalance ?? 0));
                    setTax(posts.data.orderTaxType === "" || posts.data.orderTaxType === null ? "No Tax" : posts.data.orderTaxType);

                    let dataList = [];
                    posts.data.orderIvtPoList.forEach((item, index) => {
                        let newData = {
                            rowNo: index + 1,
                            product: item.ivtId,
                            description: item.orderIvtDesc,
                            qty: item.orderIvtQty,
                            price: item.orderIvtPrice,
                            discount: item.orderIvtDiscount,
                            total: item.orderIvtTotal,
                            key: item.ivtId.toString() + index.toString(),
                            label: item.ivtClassName.toString() + " " + item.tags.map((tag) => {
                                if (tag === null) {
                                    return ''
                                }

                                return (
                                    tag.tagName + ':' + tag.tagValue
                                );
                            })
                        };
                        dataList.push(newData);
                    });

                    setData(dataList);
                    setOrderDetail(posts.data);
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Loading Order Detail Error!'
                    })
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Loading Order Detail Error!'
                })
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        updateFormData();
        updateCustomerFormData();
    }, [orderDetail])

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                const posts = await searchCustomerList(searchValue);
                if (posts.code === 200) {
                    setCustomerList(posts.data.customerInterPos);
                } else {
                    messageApi.open({
                        type: "error",
                        content: "Loading Customers Error!",
                    });
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [searchValue]);

    const handleInputChange = (rowNo, dataIndex, value) => {
        const newData = data.map((item) => {
            if (item.rowNo === rowNo) {
                if (dataIndex === 'qty') {
                    return { ...item, [dataIndex]: value, total: value * item.price * (1 - item.discount / 100) }
                }
                if (dataIndex === 'price') {
                    return { ...item, [dataIndex]: value, total: value * item.qty * (1 - item.discount / 100) }
                }
                if (dataIndex === 'discount') {
                    return { ...item, [dataIndex]: value, total: item.price * item.qty * (1 - value / 100) }
                }
                return { ...item, [dataIndex]: value, };
            }
            return item;
        });

        setData(newData);
        updateSubTotal(newData);
    };

    const handleSearchChange = async (value) => {
        try {
            const posts = await searchProductList(value, false);
            setProductList(posts.ivtResultPos);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            messageApi.open({
                type: "error",
                content: "Loading Product Error!",
            });
        }
    }

    const updateFormData = () => {
        data.forEach((item) => {
            form.setFieldsValue({ [`product_${item.key}`]: item.label ?? "" });
            form.setFieldsValue({ [`description_${item.key}`]: item.description ?? "" });
            form.setFieldsValue({ [`price_${item.key}`]: item.price ?? "" });
            form.setFieldsValue({ [`discount_${item.key}`]: item.discount ?? "" });
            form.setFieldsValue({ [`qty_${item.key}`]: item.qty ?? "" });
        })
    }

    const updateCustomerFormData = () => {
        setSelectedCustomer(orderDetail.customerInterPo?.customerId.toString() ?? "");
        customerForm.setFieldsValue({
            companyName: orderDetail.orderCompanyName,
            customerName: orderDetail.orderCustomerName,
            customerPhone: orderDetail.orderCustomerPhone,
            customerEmail: orderDetail.orderCustomerEmail,
            deliveryAddress: orderDetail.orderDeliveryAddress,
            billingAddress: orderDetail.orderBillingAddress,
        })
    }

    const handleSelectedCustomer = (e) => {
        setSearchValue('');
        setSelectedCustomer(e);
        fetchCustomerDetail(e);
    }

    const fetchCustomerDetail = async (customerId) => {
        try {
            const posts = await getCustomerDetailById(customerId);
            if (posts.code === 200) {
                customerForm.setFieldsValue({
                    companyName: posts.data.companyName,
                    customerName: posts.data.customerName,
                    customerPhone: posts.data.customerPhone,
                    customerEmail: posts.data.customerEmail,
                    deliveryAddress: posts.data.deliveryAddress,
                    billingAddress: posts.data.billingAddress,
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSelectChange = (rowNo, selectedProduct) => {
        const newData = data.map((item) => {
            if (item.rowNo === rowNo) {
                form.setFieldsValue({ [`description_${item.key}`]: selectedProduct.ivtNote ?? "" });
                form.setFieldsValue({ [`price_${item.key}`]: selectedProduct.ivtPrice ?? "" });
                form.setFieldsValue({ [`discount_${item.key}`]: 0 });
                return {
                    ...item, product: selectedProduct.ivtId,
                    description: selectedProduct.ivtNote,
                    price: selectedProduct.ivtPrice,
                    discount: 0,
                    total: item.qty * selectedProduct.ivtPrice
                };
            }
            return item;
        });

        setData(newData);
    }

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'qty' || col.dataIndex === "price" || col.dataIndex === "discount" ? 'number' : col.dataIndex === 'product' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: true,
                form,
                onDataChange: handleInputChange,
                onSearchChange: handleSearchChange,
                onSelectChange: handleSelectChange,
                productList: productList,
            }),
        };
    });

    const handleOrderIdChange = (e) => {
        setOrderId(e.target.value);
    };

    const handleOrderDateChange = (date) => {
        setOrderDate(date);
    };

    const handleCustomerOrderNoChange = (e) => {
        setCustomerOrderNo(e.target.value);
    };

    const handleOrderNoteChange = (e) => {
        setOrderNote(e.target.value);
    }

    const onCancelClick = () => {
        navigate(-1);
    }

    const updateSubTotal = (newData) => {
        let subTotal = 0.00;
        newData.forEach((eachData) => {
            subTotal += parseFloat(eachData.total);
        })

        setProductTotal(subTotal);
    }

    const handleTaxChange = (value) => {
        setTax(value);
    }

    const renderTax = () => {
        if (tax === "Include") {
            return ((productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee)) / 11).toFixed(2);
        }
        else if (tax === "Exclude") {
            return ((productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee)) * 0.1).toFixed(2);
        }
        else {
            return 0.00.toFixed(2);
        }
    }

    const renderOrderTotal = () => {
        if (tax === "Include") {
            return (productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee)).toFixed(2);
        }
        else if (tax === "Exclude") {
            return ((productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee)) * 1.1).toFixed(2);
        }
        else {
            return (productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee)).toFixed(2);
        }
    }

    const renderTotal = () => {
        if (tax === "Include") {
            return (productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee) + parseFloat(prevBalance)).toFixed(2);
        }
        else if (tax === "Exclude") {
            return (((productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee)) * 1.1) + parseFloat(prevBalance)).toFixed(2);
        }
        else {
            return (productTotal * (1 - productDiscount / 100) + parseFloat(shippingFee) + parseFloat(prevBalance)).toFixed(2);
        }
    }

    const validateSave = () => {
        let isValid = true;
        let reason = "";

        if (orderId.trim() === '') {
            isValid = false;
            reason = "Order Id cannot be empty!";
            return { isValid, reason };
        }

        if (orderDate === null) {
            isValid = false;
            reason = "Order Date cannot be empty!";
            return { isValid, reason };
        }

        if (productDiscount < 0 || productDiscount > 100) {
            isValid = false;
            reason = "Discount should between 0 and 100!";
            return { isValid, reason };
        }

        data.forEach(item => {
            if (item.product === '') {
                isValid = false;
                reason = "Product cannot be empty!";
                return { isValid, reason };
            }

            if (item.qty === 0) {
                isValid = false;
                reason = "QTY cannot be 0!";
                return { isValid, reason };
            }

            if (item.discount < 0 || item.discount > 100) {
                isValid = false;
                reason = "Item Discount should between 0 and 100!";
                return { isValid, reason };
            }
        })

        return { isValid, reason };
    }

    const onSaveClick = async () => {
        const { isValid, reason } = validateSave();
        if (isValid) {
            try {
                const newCustomerDetails = customerForm.getFieldValue();
                const queryBody = {
                    //Order
                    "orderDBId": orderDetail.orderDBId.toString(),
                    "orderId": orderId,
                    "orderDate": moment(orderDate.toString()).format("YYYY/MM/DD"),
                    "orderNote": orderNote,
                    "customerOrderNo": customerOrderNo,
                    "orderSubTotal": productTotal,
                    "orderDiscount": productDiscount,
                    "orderShippingFee": shippingFee,
                    "orderPreBalance": prevBalance,
                    "isCashSale": isCashSale,
                    "orderTaxType": tax,
                    //Customer
                    "customerId": selectedCustomer,
                    "orderCompanyName": newCustomerDetails.companyName ?? "",
                    "orderCustomerName": newCustomerDetails.customerName ?? "",
                    "orderDeliveryAddress": newCustomerDetails.deliveryAddress ?? "",
                    "orderBillingAddress": newCustomerDetails.billingAddress ?? "",
                    "orderCustomerPhone": newCustomerDetails.customerPhone ?? "",
                    "orderCustomerEmail": newCustomerDetails.customerEmail ?? "",
                    //Product
                    "productList": data,
                };
                //console.log(queryBody);
                const posts = await editOrderById(queryBody);
                if (posts.code === 200) {
                    messageApi.open({
                        type: 'success',
                        content: 'Save Order Success!',
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000)
                }
                else {
                    messageApi.open({
                        type: "error",
                        content: "Save Order Error!",
                    });
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
                messageApi.open({
                    type: "error",
                    content: "Save Order Error!",
                });
            }

        }
        else {
            messageApi.open({
                type: "error",
                content: reason,
            });
        }
    }

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const posts = await searchProductList("", false);
                setProductList(posts.ivtResultPos);
            }
            catch (error) {
                console.error('Error fetching data:', error);
                messageApi.open({
                    type: "error",
                    content: "Loading Product Error!",
                });
            }
        }

        fetchProductData();
    }, []);

    return (
        <div className="ivt-layout">
            <Layout>
                {contextHolder}
                <Content style={{ margin: '10px' }}>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: 'Home',
                                href: '/'
                            },
                            {
                                title: 'Orders',
                                href: '/orders',
                            },
                            {
                                title: "Edit Order"
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        } />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                        <Button danger icon={<LeftOutlined />} size="large" onClick={onCancelClick} style={{ backgroundColor: "red", color: "white" }} className="edit-customer-details-button" > Back </Button>
                        <Button icon={<SaveOutlined />} size="large" onClick={onSaveClick} style={{ backgroundColor: "green", color: "white" }} className="edit-customer-details-button" > Save </Button>
                    </div>


                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card bordered={false} style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}><span className="item-span">* Order ID</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Order ID"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={orderId}
                                                onChange={handleOrderIdChange}
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">* Order Date</span></Col>
                                        <Col span={18}>
                                            <DatePicker
                                                format='DD/MM/YYYY'
                                                value={orderDate}
                                                onChange={handleOrderDateChange}
                                                placeholder="Order Date"
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">Customer Order No</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Customer Order No"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={customerOrderNo}
                                                onChange={handleCustomerOrderNoChange}
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">Cash Sale</span></Col>
                                        <Col span={18}>
                                            <Switch value={isCashSale} onChange={(value) => {
                                                setIsCashSale(value);
                                                if (value) {
                                                    setTax("No Tax");
                                                }
                                            }} />
                                        </Col>

                                        <Col span={6}><span className="item-span">Order Note</span></Col>
                                        <Col span={18}>
                                            <Input.TextArea
                                                placeholder="Order Note"
                                                style={{ minHeight: "300px" }}
                                                value={orderNote}
                                                onChange={handleOrderNoteChange}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card bordered={false} style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <Form form={customerForm} name="customerForm" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                                                style={{ maxWidth: "100%", marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
                                                <Form.Item
                                                    label="* Company Name"
                                                    name="companyName">
                                                    {/* <Input placeholder="* Company Name" className="form-item"/> */}
                                                    <Select
                                                        showSearch
                                                        className="form-item"
                                                        value={selectedCustomer}
                                                        placeholder="Search for customer"
                                                        onSearch={(value) => setSearchValue(value)}
                                                        onChange={handleSelectedCustomer}
                                                        optionLabelProp="label"
                                                        loading={loading}
                                                        defaultActiveFirstOption={false}
                                                        filterOption={false}
                                                        style={{ width: '100%' }}>
                                                        {customerList.map((customer) => (
                                                            <Option key={customer.customerId.toString()} value={customer.customerId.toString()} label={customer.companyName.toString()}>
                                                                <div>{`${customer.companyName}`}</div>
                                                                {customer.customerName && <div>{`Name: ${customer.customerName}`}</div>}
                                                                {customer.customerPhone && <div>{`Phone: ${customer.customerPhone}`}</div>}
                                                                {customer.customerEmail && <div>{`Email: ${customer.customerEmail}`}</div>}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item name="customerName" label="Customer Name">
                                                    <Input placeholder="Customer Name" className="form-item" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Customer Email"
                                                    name="customerEmail"
                                                    rules={[
                                                        { type: "email", message: "Invalid email format" },
                                                    ]}>
                                                    <Input placeholder="Email" className="form-item" />
                                                </Form.Item>

                                                <Form.Item label="Phone Number" name="customerPhone">
                                                    <Input placeholder="Phone Number" className="form-item" />
                                                </Form.Item>

                                                <Form.Item label="Delivery Address" name="deliveryAddress">
                                                    <Input placeholder="Delivery Address" className="form-item" />
                                                </Form.Item>

                                                <Form.Item label="Billing Address" name="billingAddress">
                                                    <Input placeholder="Billing Address" className="form-item" />
                                                </Form.Item>
                                            </Form>
                                        </Col>

                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Form form={form} component={false} loading={loading}>
                            <Table
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                rowKey={"rowNo"}
                                bordered
                                dataSource={data}
                                columns={mergedColumns}
                                rowClassName="editable-row"
                                pagination={false} />
                        </Form>

                        <Row gutter={[16, 16]} style={{ margin: '20px' }}>
                            <Col span={6} offset={12}><span className="item-span">SUBTOTAL</span></Col>
                            <Col span={6}><span className="item-span" style={{ paddingRight: "8px" }}>{productTotal.toFixed(2)}</span></Col>

                            <Col span={6} offset={12}><span className="item-span">DISCOUNT(%)</span></Col>
                            <Col span={6}>
                                <Input
                                    placeholder="0"
                                    style={{ border: 'none', borderBottom: '1px solid #d9d9d9', textAlign: 'right', height: '20px' }}
                                    value={productDiscount}
                                    onChange={(e) => { setProductDiscount(e.target.value); }}
                                />
                            </Col>

                            <Col span={6} offset={12}><span className="item-span">SHIPPING</span></Col>
                            <Col span={6}>
                                <Input
                                    placeholder="0"
                                    style={{ border: 'none', borderBottom: '1px solid #d9d9d9', textAlign: 'right' }}
                                    value={shippingFee}
                                    onChange={(e) => { setShippingFee(e.target.value); }}
                                />
                            </Col>

                            {isCashSale ?
                                <></> :
                                <>
                                    <Col span={6} offset={12}><span className="item-span">GST</span></Col>
                                    <Col span={3}>
                                        <Select
                                            onChange={handleTaxChange}
                                            placeholder="tax"
                                            optionLabelProp="label"
                                            defaultActiveFirstOption={false}
                                            filterOption={false}
                                            defaultValue={tax}
                                            value={tax}
                                            style={{ width: '100%' }}>
                                            {taxList.map((tax) => (
                                                <Option key={tax} value={tax} label={tax} />
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col span={3}><span className="item-span" style={{ paddingRight: "8px" }}>{renderTax()}</span></Col>
                                </>
                            }

                            <Col span={6} offset={12}><span className="item-span">ORDER TOTAL</span></Col>
                            <Col span={6}><span className="item-span" style={{ paddingRight: "8px" }}>{renderOrderTotal()}</span></Col>

                            <Col span={6} offset={12}><span className="item-span">PREVIOUS BALANCE</span></Col>
                            <Col span={6}>
                                <Input
                                    placeholder="0"
                                    style={{ border: 'none', borderBottom: '1px solid #d9d9d9', textAlign: 'right', height: '20px' }}
                                    value={prevBalance}
                                    onChange={(e) => { setPrevBalance(e.target.value); }}
                                />
                            </Col>

                            <Col span={6} offset={12}><span className="item-span">ALL TOTAL</span></Col>
                            <Col span={6}><span className="item-span" style={{ paddingRight: "8px" }}>{renderTotal()}</span></Col>
                        </Row>
                    </Card>
                </Content>
            </Layout >
        </div>
    );
};

export default EditOrderPage;