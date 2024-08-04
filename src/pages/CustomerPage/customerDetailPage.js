import React, { useState, useEffect } from "react"
import "./index.scss"
import {
    Form,
    Layout,
    Breadcrumb,
    Button,
    Card,
    Table,
    Tag,
    Row,
    Col,
    message,
    Modal,
    Input,
    Select,
} from 'antd';
import {
    EditOutlined, DeleteOutlined, UserOutlined, CarOutlined, AccountBookOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { editCustomer, deleteCustomer, getCustomerDetailById, ordersDataByCustomerId } from '../../api/api.js'
import moment from "moment";
import dayjs from "dayjs";


const CustomerDetailsPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');

    const { Content } = Layout;
    const { Option } = Select;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm();

    const [recordData, setRecordData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await getCustomerDetailById(customerId);
                if (posts.code === 200) {
                    setRecordData(posts.data);
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Loading Customer Detail Error!'
                    })
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Loading Customer Detail Error!'
                })
            }
        }
        fetchData();
    }, []);

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchParams, setSearchParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
            total: 0,
        },
    })

    const fetchDataAndUpdateState = async () => {
        try {
            setDataSource([]);
            setLoading(true);
            const posts = await ordersDataByCustomerId(searchParams, customerId);
            if (posts.code === 200) {
                setDataSource(posts.data.responsePoList);
                setSearchParams({
                    ...searchParams,
                    pagination: {
                        ...searchParams.pagination,
                        total: posts.data.count,
                    },
                });
            } else {
                messageApi.open({
                    type: "error",
                    content: "Loading Orders Error!",
                });
            }
        } catch (error) {
            console.log(error);
            messageApi.open({
                type: "error",
                content: "Loading Orders Error!",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAndUpdateState();
    }, [JSON.stringify(searchParams)]);

    const [editVisible, setEditVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const showEditModel = () => {
        setEditVisible(true);
    }

    const [deleteVisible, setDeleteVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const showDeleteModel = () => {
        setDeleteVisible(true);
    }

    const handleEditOk = async () => {
        form.validateFields().then(async (values) => {
            setEditLoading(true);

            try {
                const posts = await editCustomer(values, recordData.customerId);
                if (posts.code === 200) {
                    setEditVisible(false);
                    form.resetFields();
                    messageApi.open({
                        type: 'success',
                        content: 'Edit Customer Success!',
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Edit Customer Error!'
                    })
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Edit Customer Error!'
                })
            }
        }).catch((errorInfo) => {
            messageApi.open({
                type: 'error',
                content: 'Please fill in the required fields!'
            })

        }).finally(() => {
            setEditLoading(false);

        });
    }

    const handleEditCancel = () => {
        setEditVisible(false);
        setEditLoading(false);
        form.resetFields();
    }

    const handleDeleteOk = async () => {
        deleteForm.validateFields().then(async (values) => {
            setDeleteLoading(true);

            try {
                const posts = await deleteCustomer(values, recordData.customerId);
                if (posts.code === 200) {
                    setEditVisible(false);
                    deleteForm.resetFields();
                    window.location.reload();
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Inactive Customer Error!'
                    })
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Inactive Customer Error!'
                })
            }
        }).catch((errorInfo) => {
            messageApi.open({
                type: 'error',
                content: 'Please fill in the required fields!'
            })
        }).finally(() => {
            setDeleteLoading(false);
        });
    }

    const handleDeleteCancel = () => {
        setDeleteVisible(false);
        setDeleteLoading(false);
        deleteForm.resetFields();
    }

    const handlePageChange = ((pagination, filters, sorter) => {
        if (pagination.pageSize !== searchParams.pagination?.pageSize) {
            pagination.current = 1;
            setDataSource([]);
        }

        setSearchParams({
            pagination,
            filters,
            ...sorter,
        });
    });

    const columns = [
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            width: "20%",
            render: (text, record) => {
                if (record.orderStatus !== "processing") {
                    return (
                        <>
                            <span>{moment(text).format('DD/MM/YYYY')}  </span>
                        </>
                    )
                }
                const originalDate = dayjs(text);
                const currentDate = dayjs();

                let isOverDue = true;
                if (record.customerInterPo === null || "immediately" === record.customerInterPo?.creditTerm) {
                    isOverDue = currentDate.isAfter(originalDate)
                }
                else if (record.customerInterPo.creditTerm.includes("30")) {
                    isOverDue = currentDate.isAfter(originalDate.add(1, 'month').endOf('month'));
                }
                else if (record.customerInterPo.creditTerm.includes("14")) {
                    isOverDue = currentDate.isAfter(originalDate.add(14, 'day'));
                }

                if (isOverDue) {
                    return (
                        <>
                            <span>{moment(text).format('DD/MM/YYYY')}  </span>
                            <Tag color={"red"}> overdue </Tag>
                        </>
                    )
                }
                else {
                    return (
                        <>
                            <span>{moment(text).format('DD/MM/YYYY')}  </span>
                        </>
                    )
                }
            }
        },
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            width: "15%",
            key: 'orderId',
            render: (orderId, record) => {
                const url = `/orderDetails?orderDBId=${record.orderDBId}`;
                return (
                    <NavLink to={url}>
                        {orderId}
                    </NavLink>
                );
            },
        },
        {
            title: 'Customer Order No',
            dataIndex: 'customerOrderNo',
            width: "15%",
        },
        {
            title: 'Order Note',
            dataIndex: 'orderNote',
            width: "20%",

        },
        {
            title: 'Total(AUD)',
            dataIndex: 'totalPrice',
            width: "10%",
            render: (_, record) => {
                const total = parseFloat(record.orderSubTotal) * (1 - (record.orderDiscount ?? 0) / 100) + parseFloat(record.orderShippingFee) + parseFloat(record.orderPreBalance);
                const formattedTotal = total.toFixed(2);
                return ` ${formattedTotal}`;
            },
        },
        {
            title: 'Status',
            dataIndex: 'orderStatus',
            width: "10%",
            filters: [
                { text: "processing", value: "processing" },
                { text: "reversed", value: "reversed" },
                { text: "completed", value: "completed" },
            ],
            render: (status) => {
                const color = status === "processing" ? 'orange' :
                    (status === "reversed" ? 'red' : 'green');

                return (
                    <span>
                        <Tag color={color}>
                            {status}
                        </Tag>
                    </span>
                );
            }
        }
    ]


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
                                title: 'Customers',
                                href: '/customers',
                            },
                            {
                                title: recordData.companyName,
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        } />

                    <div style={{ display: 'flex', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
                        <div style={{ marginLeft: 'auto' }}>
                            <Button type="default" icon={<EditOutlined />} size="large" onClick={showEditModel} className="edit-customer-details-button" style={{ backgroundColor: "orange", color: "white" }}> Edit</Button>
                            <Button danger icon={<DeleteOutlined />} size="large" onClick={showDeleteModel} className="edit-customer-details-button" disabled={recordData.delFlag !== "active"} style={{ backgroundColor: "red", color: "white" }}> Inactive</Button>
                        </div>
                    </div>

                    <Modal
                        title="Edit Customer"
                        open={editVisible}
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                        maskClosable={false}
                        width={600}
                        centered
                        footer={[
                            <Button key="back" onClick={handleEditCancel} style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} size="large">
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" loading={editLoading} onClick={handleEditOk} style={{ display: 'inline-block', width: 'calc(50% - 12px)', margin: '0 12px' }} size="large">
                                Save
                            </Button>,
                        ]}>

                        <span style={{ fontSize: '14px', fontWeight: 'normal' }}>Customer Information</span>

                        <Form form={form} name="customerForm" style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '60px' }}
                            layout="vertical">
                            <Form.Item
                                label="Company Name"
                                name="companyName"
                                rules={[{ required: true, message: "Please enter the company name" }]}
                                initialValue={recordData.companyName}>
                                <Input placeholder="* Company Name" className="form-item" />
                            </Form.Item>

                            <Form.Item name="customerName" label="Customer Name" initialValue={recordData.customerName}>
                                <Input placeholder="Customer Name" className="form-item" />
                            </Form.Item>

                            <Form.Item
                                label="Customer Email"
                                name="customerEmail"
                                initialValue={recordData.customerEmail}>
                                <Input placeholder="Email" className="form-item" />
                            </Form.Item>

                            <Form.Item label="Phone Number" name="customerPhone" initialValue={recordData.customerPhone}>
                                <Input placeholder="Phone Number" className="form-item" />
                            </Form.Item>

                            <Form.Item
                                label="Credit Term"
                                name="creditTerm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select credit term!',
                                    },
                                ]}
                                initialValue={recordData.creditTerm}>
                                <Select placeholder="* Credit Term" className="form-item">
                                    <Option value="immediately">COD</Option>
                                    <Option value="NET 30">NET 30</Option>
                                    <Option value="14 days">14 days</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Note" name="note" initialValue={recordData.customerNote}>
                                <Input.TextArea placeholder="Note" style={{ height: '150px' }} />
                            </Form.Item>

                            <Form.Item label="Delivery Address" name="customerDeliveryAddress" initialValue={recordData.deliveryAddress}>
                                <Input placeholder="Delivery Address" className="form-item" />
                            </Form.Item>

                            <Form.Item label="Billing Address" name="customerBillingAddress" initialValue={recordData.billingAddress}>
                                <Input placeholder="Billing Address" className="form-item" />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Inactive Customer"
                        open={deleteVisible}
                        onOk={handleDeleteOk}
                        onCancel={handleDeleteCancel}
                        maskClosable={false}
                        width={600}
                        centered
                        footer={[
                            <Button key="back" onClick={handleDeleteCancel} style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} size="large">
                                Cancel
                            </Button>,
                            <Button key="submit" danger loading={deleteLoading} onClick={handleDeleteOk} style={{ display: 'inline-block', width: 'calc(50% - 12px)', margin: '0 12px' }} size="large">
                                Inactive
                            </Button>,
                        ]}>

                        <Form form={deleteForm} name="deleteForm" style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '60px' }}
                            layout="vertical">
                            <Form.Item label="Reason" name="reason">
                                <Input.TextArea placeholder="Reason" style={{ height: '150px' }} />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 64]}>
                            <Col span={8}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <UserOutlined />
                                            </Col>
                                            <Col span={16}>
                                                {recordData.companyName}
                                            </Col>
                                            <Col span={6}>
                                                <Tag color={recordData.delFlag === "active" ? 'green' : 'volcano'}> {recordData.delFlag}</Tag>
                                            </Col>
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Company Name</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.companyName}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Customer Name</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.customerName}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Phone</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.customerPhone}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Email</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.customerEmail}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <CarOutlined />
                                            </Col>
                                            <Col span={18}>
                                                Addresses
                                            </Col>
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Delivery Address</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.deliveryAddress}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Billing Address</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.billingAddress}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <AccountBookOutlined />
                                            </Col>
                                            <Col span={18}>
                                                Notes
                                            </Col>
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Credit Term</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.creditTerm}</span>
                                        </Col>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Note</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.customerNote}</span>
                                        </Col>
                                        {
                                            recordData.delFlag !== "active" ? (
                                                <Col span={24}>
                                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Inactive Reason</span><br />
                                                    <span style={{ fontSize: '12px' }}>{recordData.customerDelNote ?? ""}</span>
                                                </Col>
                                            ) : (<></>)
                                        }
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Table
                            rowKey={"orderDBId"}
                            columns={columns}
                            dataSource={dataSource}
                            pagination={searchParams.pagination}
                            loading={loading}
                            onChange={handlePageChange}
                        />
                    </Card>
                </Content>
            </Layout >
        </div>
    );
};

export default CustomerDetailsPage;