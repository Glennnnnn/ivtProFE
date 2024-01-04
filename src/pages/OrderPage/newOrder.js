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
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons'
import moment from "moment";
import { searchCustomerList } from "@/api/api.js";

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
    ...restProps
}) => {
    const isNumberInput = inputType === 'number';

    const handleInputChange = (value) => {
        onDataChange(record.rowNo, dataIndex, value);
    };

    const inputNode = isNumberInput ? <InputNumber min={0} onChange={handleInputChange} /> : <Input onChange={(e) => handleInputChange(e.target.value)} />;

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
    const { Option } = Select;
    const [messageApi, contextHolder] = message.useMessage();
    const today = moment();

    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState(null);
    const [customerOrderNo, setCustomerOrderNo] = useState('');
    const [orderNote, setOrderNote] = useState('');

    const [showCustomer, setShowCustomer] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState();

    const [form] = Form.useForm();
    const [data, setData] = useState(
        [
            {
                rowNo: 1,
                product: '',
                description: '',
                qty: 0,
                amount: 0,
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
            width: '20%',
            editable: true,
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
            width: '10%',
            editable: true,
        },
        {
            title: 'Amount(AUD)',
            dataIndex: 'amount',
            width: '15%',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            width: '15%',
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
            amount: 0,
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
                amount: 0,
            }])
        }
    };

    const handleInputChange = (rowNo, dataIndex, value) => {
        const newData = data.map((item) => {
            if (item.rowNo === rowNo) {
                return { ...item, [dataIndex]: value };
            }
            return item;
        });

        setData(newData);
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'qty' || col.dataIndex === "amount" ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: true,
                form,
                onDataChange: handleInputChange,
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
    }

    const onMenuClick = (e) => {
        console.log(data);
    };

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, [searchValue]);

    const buttonItems = [
        {
            key: '1',
            label: 'Save and New',
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
                        <Button danger icon={<DeleteOutlined />} size="large" className="edit-customer-details-button" > Cancel </Button>
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
                                                format='YYYY/MM/DD'
                                                value={orderDate}
                                                onChange={handleOrderDateChange}
                                                defaultValue={today}
                                                placeholder="Order Date"
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">Order Note</span></Col>
                                        <Col span={18}>
                                            <Input.TextArea
                                                placeholder="Order Note"
                                                style={{ minHeight: "150px" }}
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
                                        <Col span={6}><span className="item-span">Customer Order No</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Customer Order No"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={customerOrderNo}
                                                onChange={handleCustomerOrderNoChange}
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">New Customer</span></Col>
                                        <Col span={18}>
                                            <Switch value={showCustomer} onChange={(value) => setShowCustomer(value)} />
                                        </Col>

                                        {
                                            showCustomer ? (<></>) : (<>
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
                                rowClassName="editable-row" />
                        </Form>
                    </Card>


                </Content>
            </Layout >
        </div>
    );
};

export default NewOrderPage;