import React, { useState, useEffect } from "react"
import "./index.scss"
import {
    Layout,
    Breadcrumb,
    Button,
    message,
    Dropdown,
    Card,
    Row,
    Col,
    Input,
    DatePicker,
    Select,
    Switch,
    Table,
    InputNumber,
    Form,
    Tag,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, RedoOutlined
} from '@ant-design/icons'
import moment from "moment";
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { searchCustomerList, searchProductList, getCustomerDetailById, addOrder, queryCashSaleOrderId } from "@/api/api.js";

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
            <InputNumber onChange={handleInputChange} placeholder="0" controls={false} />
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


const NewOrderPage = () => {
    const { Content } = Layout;
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState(dayjs());
    const [customerOrderNo, setCustomerOrderNo] = useState('');
    const [orderNote, setOrderNote] = useState('');

    const [productTotal, setProductTotal] = useState(0.00);
    const [shippingFee, setShippingFee] = useState(0.00);
    const [prevBalance, setPrevBalance] = useState(0.00);
    const [allTotal, setAllTotal] = useState(0.00);

    const [isCashSale, setIsCashSale] = useState(false);
    const [showCustomer, setShowCustomer] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customerDetails, setCustomerDetails] = useState({});

    const [productList, setProductList] = useState([]);
    const [cashSaleOrderId, setCashSaleOrderId] = useState("");
    const [accountSaleOrderId, setAccountSaleOrderId] = useState("");
    const [tax, setTax] = useState("Exclude");

    const taxList = [
        "Include", "Exclude", "No Tax"
    ]

    const [form] = Form.useForm();
    const [newCustomerForm] = Form.useForm();

    const [data, setData] = useState(
        [
            {
                rowNo: 1,
                product: '',
                description: '',
                qty: 0,
                price: 0,
                total: 0,
                key: 1,
            }
        ]
    );

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
            width: '15%',
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
                total: 0,
                key: 1,
            }])
        }
    };

    const handleInputChange = (rowNo, dataIndex, value) => {
        const newData = data.map((item) => {
            if (item.rowNo === rowNo) {
                if (dataIndex === 'qty') {
                    return { ...item, [dataIndex]: value, total: value * item.price }
                }
                if (dataIndex === 'price') {
                    return { ...item, [dataIndex]: value, total: value * item.qty }
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
            const posts = await searchProductList(value);
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

    const handleSelectChange = (rowNo, selectedProduct) => {
        const newData = data.map((item) => {
            if (item.rowNo === rowNo) {
                form.setFieldsValue({ [`description_${item.key}`]: selectedProduct.ivtNote ?? "" });
                form.setFieldsValue({ [`price_${item.key}`]: selectedProduct.ivtPrice ?? "" });
                return {
                    ...item, product: selectedProduct.ivtId,
                    description: selectedProduct.ivtNote,
                    price: selectedProduct.ivtPrice,
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
                inputType: col.dataIndex === 'qty' || col.dataIndex === "price" ? 'number' : col.dataIndex === 'product' ? 'select' : 'text',
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

    const handleSelectedCustomer = (e) => {
        setSearchValue('');
        setSelectedCustomer(e);
        fetchCustomerDetail(e);
    }

    const handleEditCustomer = () => {
        window.open(`/customerDetails?customerId=${selectedCustomer}`);
    }

    const fetchCustomerDetail = async (customerId) => {
        try {
            const posts = await getCustomerDetailById(customerId);
            if (posts.code === 200) {
                setCustomerDetails(posts.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleRefreshCustomer = () => {
        fetchCustomerDetail(selectedCustomer);
    }

    const handleTaxChange = (value) => {
        setTax(value);
    }

    const renderTax = () => {
        if (tax === "Include") {
            return ((allTotal - prevBalance) / 11).toFixed(2);
        }
        else if (tax === "Exclude") {
            return ((allTotal - prevBalance) * 0.1).toFixed(2);
        }
        else {
            return 0.00.toFixed(2);
        }
    }

    const renderOrderTotal = () => {
        if (tax === "Include") {
            return ((allTotal - prevBalance)).toFixed(2);
        }
        else if (tax === "Exclude") {
            return ((allTotal - prevBalance) * 1.1).toFixed(2);
        }
        else {
            return (allTotal - prevBalance).toFixed(2);
        }
    }

    const renderTotal = () => {
        if (tax === "Include") {
            return allTotal.toFixed(2);
        }
        else if (tax === "Exclude") {
            return (parseFloat((allTotal - prevBalance) * 1.1) + parseFloat(prevBalance)).toFixed(2);
        }
        else {
            return allTotal.toFixed(2);
        }
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
        updateTotal(subTotal);
    }

    const updateTotal = (subTotal) => {
        let thisShipping = shippingFee === "" ? 0 : shippingFee;
        let thisPrevBalance = prevBalance === "" ? 0 : prevBalance;

        setAllTotal(parseFloat(subTotal) + parseFloat(thisShipping) + parseFloat(thisPrevBalance));
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

        if (showCustomer) {
            const customerFormData = newCustomerForm.getFieldValue();
            if (!customerFormData.hasOwnProperty('companyName') || (customerFormData.companyName?.trim() === '')) {
                isValid = false;
                reason = "Company name cannot be empty!";
                return { isValid, reason };
            }
            if (!customerFormData.hasOwnProperty('creditTerm')) {
                isValid = false;
                reason = "Credit Term cannot be empty!";
                return { isValid, reason };
            }

        }
        else {
            if (selectedCustomer.trim() === '') {
                isValid = false;
                reason = "Customer cannot be empty!";
                return { isValid, reason };
            }
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
        })

        return { isValid, reason };
    }

    const onMenuClick = async (e) => {
        const { isValid, reason } = validateSave();
        if (isValid) {
            try {
                const newCustomerDetails = newCustomerForm.getFieldValue();
                const queryBody = {
                    "orderId": orderId,
                    "orderDate": moment(orderDate.toString()).format("YYYY/MM/DD"),
                    "orderNote": orderNote,
                    "customerOrderNo": customerOrderNo,
                    "isNewCustomer": showCustomer,
                    "isCashSale": isCashSale,
                    "customerId": selectedCustomer,
                    "orderShippingFee": shippingFee,
                    "orderPreBalance": prevBalance,
                    "newCustomerDetails": {
                        "companyName": newCustomerDetails.companyName ?? "",
                        "customerName": newCustomerDetails.customerName ?? "",
                        "deliveryAddress": newCustomerDetails.customerDeliveryAddress ?? "",
                        "billingAddress": newCustomerDetails.customerBillingAddress ?? "",
                        "customerPhone": newCustomerDetails.customerPhone ?? "",
                        "customerEmail": newCustomerDetails.customerEmail ?? "",
                        "customerNote": newCustomerDetails.note ?? "",
                        "creditTerm": newCustomerDetails.creditTerm ?? "",
                        "isSaveCustomer": newCustomerDetails.isSaveCustomer ?? false,
                    },
                    "productList": data,
                    "orderTaxType": tax,
                };

                const posts = await addOrder(queryBody);
                if (posts.code === 200) {
                    messageApi.open({
                        type: "success",
                        content: "Save Order Success!",
                    });
                    setTimeout(() => {
                        if (e.key === "2") {
                            navigate(-1);
                        }
                        if (e.key === "3") {
                            const orderDBId = posts.data.toString();
                            window.location.href = `/orderDetails?orderDBId=${orderDBId}`;
                        }
                        else {
                            window.location.reload();
                        }
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

    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const posts = await searchProductList("");
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

        const fetchCashSaleOrderId = async () => {
            try {
                const gets = await queryCashSaleOrderId();
                setCashSaleOrderId(gets.data.cashSale);
                setAccountSaleOrderId(gets.data.accountSale);
                setOrderId(gets.data.accountSale);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchProductData();
        fetchCashSaleOrderId();
    }, []);

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

    useEffect(() => {
        updateTotal(productTotal);
    }, [shippingFee])

    useEffect(() => {
        updateTotal(productTotal);
    }, [prevBalance])

    const buttonItems = [
        {
            key: '1',
            label: 'Save and New',
        },
        {
            key: '3',
            label: 'Save and Open',
        },
        {
            key: '2',
            label: 'Save and Close',
        },
    ];

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
                                title: "New Order"
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        } />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                        <Button icon={<DeleteOutlined />} size="large" onClick={onCancelClick} style={{ backgroundColor: "red", color: "white" }} className="edit-customer-details-button" > Cancel </Button>
                        <Dropdown.Button type="default" icon={<EditOutlined />} size="large" className="edit-customer-details-button" onClick={onMenuClick}
                            menu={{ items: buttonItems, onClick: onMenuClick }} > Save and New
                        </Dropdown.Button>
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
                                        <Col span={6}><span className="item-span">Cash Sale</span></Col>
                                        <Col span={18}>
                                            <Switch value={isCashSale} onChange={(value) => {
                                                setOrderId(value ? cashSaleOrderId : accountSaleOrderId)
                                                setIsCashSale(value);
                                                if(value){
                                                    setTax("No Tax");
                                                }
                                            }} />
                                        </Col>
                                        <Col span={6}><span className="item-span">New Customer</span></Col>
                                        <Col span={18}>
                                            <Switch value={showCustomer} onChange={(value) => { setShowCustomer(value); setSelectedCustomer(''); newCustomerForm.resetFields(); }} />
                                        </Col>

                                        {
                                            showCustomer ? (
                                                <>
                                                    <Col span={24}>
                                                        <Form form={newCustomerForm} name="customerForm" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                                                            style={{ maxWidth: "100%", marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
                                                            <Form.Item
                                                                label="Save Customer"
                                                                name="isSaveCustomer"
                                                                valuePropName="checked">
                                                                <Switch />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="* Company Name"
                                                                name="companyName">
                                                                <Input placeholder="* Company Name" className="form-item" />
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

                                                            <Form.Item
                                                                label="* Credit Term"
                                                                name="creditTerm">
                                                                <Select placeholder="* Credit Term" className="form-item">
                                                                    <Option value="immediately">Immediately</Option>
                                                                    <Option value="30 days">30 days</Option>
                                                                    <Option value="60 days">60 days</Option>
                                                                </Select>
                                                            </Form.Item>

                                                            <Form.Item label="Note" name="note">
                                                                <Input.TextArea placeholder="Note" style={{ height: '50px' }} />
                                                            </Form.Item>

                                                            <Form.Item label="Delivery Address" name="customerDeliveryAddress">
                                                                <Input placeholder="Delivery Address" className="form-item" />
                                                            </Form.Item>

                                                            <Form.Item label="Billing Address" name="customerBillingAddress">
                                                                <Input placeholder="Billing Address" className="form-item" />
                                                            </Form.Item>
                                                        </Form>
                                                    </Col>
                                                </>) : (<>
                                                    <Col span={6}><span className="item-span">Existing Customer</span></Col>
                                                    <Col span={18}>
                                                        <Select
                                                            showSearch
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
                                                    </Col>

                                                    <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Button type="default" icon={<EditOutlined />} size="large"
                                                            onClick={handleEditCustomer}
                                                            disabled={selectedCustomer === ''}
                                                            className="edit-customer-details-button" > Edit </Button>
                                                    </Col>
                                                    <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Button type="default" icon={<RedoOutlined />} size="large"
                                                            onClick={handleRefreshCustomer}
                                                            disabled={selectedCustomer === ''}
                                                            className="edit-customer-details-button" > Refresh </Button>
                                                    </Col>
                                                    {
                                                        selectedCustomer === '' ? (<></>) : (
                                                            <>
                                                                <Col span={6}><span className="item-span">Company Name</span></Col>
                                                                <Col span={18}>{customerDetails.companyName}</Col>

                                                                <Col span={6}><span className="item-span">Customer Name</span></Col>
                                                                <Col span={18}>{customerDetails.customerName}</Col>

                                                                <Col span={6}><span className="item-span">Phone</span></Col>
                                                                <Col span={18}>{customerDetails.customerPhone}</Col>

                                                                <Col span={6}><span className="item-span">Email</span></Col>
                                                                <Col span={18}>{customerDetails.customerEmail}</Col>

                                                                <Col span={6}><span className="item-span">Delivery Address</span></Col>
                                                                <Col span={18}>{customerDetails.deliveryAddress}</Col>

                                                                <Col span={6}><span className="item-span">Billing Address</span></Col>
                                                                <Col span={18}>{customerDetails.billingAddress}</Col>
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )
                                        }

                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Form form={form} component={false}>
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

                            <Col span={6} offset={12}><span className="item-span">SHIPPING</span></Col>
                            <Col span={6}>
                                <Input
                                    placeholder="0"
                                    style={{ border: 'none', borderBottom: '1px solid #d9d9d9', textAlign: 'right', height: '20px' }}
                                    value={shippingFee}
                                    onChange={(e) => { setShippingFee(e.target.value); }}
                                />
                            </Col>
                            
                            {
                                isCashSale ? <></> :
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

export default NewOrderPage;