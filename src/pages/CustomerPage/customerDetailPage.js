import React, { useState } from "react"
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
import { useLocation } from 'react-router-dom';
import { editCustomer, deleteCustomer } from '../../api/api.js'


const CustomerDetailsPage = () => {
    const { Content } = Layout;
    const { Option } = Select;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm();
    let location = useLocation();
    const recordData = JSON.parse(location.state.customerDetails);

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchParams, setSearchParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    })

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
                    window.location.reload();
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
            title: 'Order Number',
            dataIndex: 'orderNumber',
            width: 220,
            key: 'orderId',
            render: (orderNumber, record) => {
                return <NavLink>{orderNumber}</NavLink>
            }
        },
        {
            title: 'Customer Order Number',
            dataIndex: 'customerOrderNumber',
            width: 220,
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            sorter: true,
        },
        {
            title: 'Order Total',
            dataIndex: 'orderTotal',
        },
        {
            title: 'Status',
            dataIndex: 'delFlag',
            filters: [
                { text: 'active', value: 'active' },
                { text: 'inactive', value: 'inactive' },
            ],
            render: (status) => (
                <span>
                    <Tag color={status === "active" ? 'green' : 'volcano'}> {status} </Tag>
                </span>
            ),
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
                            <Button type="default" icon={<EditOutlined />} size="large" onClick={showEditModel} className="edit-customer-details-button" > Edit</Button>
                            <Button danger icon={<DeleteOutlined />} size="large" onClick={showDeleteModel} className="edit-customer-details-button" disabled={recordData.delFlag !== "active"}> Inactive</Button>
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

                            <Form.Item name="customerName" initialValue={recordData.customerName}>
                                <Input placeholder="Customer Name" className="form-item" />
                            </Form.Item>

                            <Form.Item
                                label="Customer Name"
                                name="customerEmail"
                                rules={[
                                    { type: "email", message: "Invalid email format" },
                                ]}
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
                                    <Option value="immidiately">Immediately</Option>
                                    <Option value="30 days">30 days</Option>
                                    <Option value="60 days">60 days</Option>
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
                                    style={{ height: 'auto' }}>
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
                                    style={{ height: 'auto' }}>
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
                                    style={{ height: 'auto', minHeight: '200px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Credit Term</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.creditTerm}</span>
                                        </Col>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Note</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.customerNote}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Table
                            rowKey={"customerId"}
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