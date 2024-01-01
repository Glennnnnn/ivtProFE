import React, { useEffect, useState } from "react"
import "./index.scss"

import { Button, Card, Breadcrumb, Table, Tag, Layout, Row, Col, Modal, Form, Input, Select, Switch, message } from "antd";
import {
    TeamOutlined, ShoppingOutlined, PlusOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { addCustomer, customerList, customersSummary } from '../../api/api.js'

const CustomerPage = () => {
    const { Content } = Layout;
    const { Option } = Select;
    const { Search } = Input;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [customerNo, setCustomerNo] = useState({
        total: 0,
        active: 0,
        inactive: 0,
    });
    const [searchParams, setSearchParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    })
    const [searchName, setSearchName] = useState("");

    const [visible, setVisible] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const showModel = () => {
        setVisible(true);
    }

    const handleOk = async () => {
        form.validateFields().then(async (values) => {
            setAddLoading(true);

            try {
                const posts = await addCustomer(values);
                if (posts.code === 200) {
                    setVisible(false);
                    form.resetFields();
                    window.location.reload();
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Add New Customer Error!'
                    })
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Add New Customer Error!'
                })
            }
        }).catch((errorInfo) => {
            messageApi.open({
                type: 'error',
                content: 'Please fill in the required fields!'
            })

        }).finally(() => {
            setAddLoading(false);
        });
    }

    const handleCancel = () => {
        setVisible(false);
        setAddLoading(false);
        form.resetFields();
    }

    const onSearch = (value, _e) => {
        setSearchParams({
            ...searchParams,
            pagination: {
                ...searchParams.pagination,
                current: 1
            },
            searchName: value,
        })
    }

    const onChange = (e) => {
        if(e.target.value != searchName) {
            setSearchParams({
                ...searchParams,
                pagination: {
                    ...searchParams.pagination,
                    current: 1
                },
                searchName: e.target.value,
            })
            setSearchName(e.target.value);
        }

    }

    const fetchDataAndUpdateState = async () => {
        try {
            setDataSource([]);
            setLoading(true);
            const posts = await customerList(searchParams);
            if (posts.code === 200) {
                setDataSource(posts.data.customerInterPos);
                setSearchParams({
                    ...searchParams,
                    pagination: {
                        ...searchParams.pagination,
                        total: posts.data.queryCount
                    }
                })
            }
            else {
                messageApi.open({
                    type: 'error',
                    content: 'Loading Customers Error!'
                })
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: 'Loading Customers Error!'
            })
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAndUpdateState();
    }, [JSON.stringify(searchParams)])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await customersSummary();
                if (posts.code === 200) {
                    setCustomerNo({
                        total: posts.data.total,
                        active: posts.data.active,
                        inactive: posts.data.inactive,
                    })
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Loading Customers Summary Error!'
                    })
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Loading Customers Summary Error!'
                })
            }
        }

        fetchData();
    }, []);

    const handlePageChange = ((pagination, filters, sorter) => {
        if (pagination.pageSize !== searchParams.pagination?.pageSize) {
            console.log('page size changed');
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
            title: 'Company Name',
            dataIndex: 'companyName',
            width: 220,
            sorter: true,
            key: 'customerId',
            render: (customerName, record) => {
                return <NavLink to='/customerDetails' state={{ "customerDetails": JSON.stringify(record) }}>{customerName}</NavLink>
            }
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            width: 220,
        },
        {
            title: 'Email',
            dataIndex: 'customerEmail',
        },
        {
            title: 'Phone',
            dataIndex: 'customerPhone',
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
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
                                href: '',
                            },
                        ]}
                        style={{ marginBottom: '20px' }} />
                    <div style={{ display: 'flex', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
                        <div style={{ marginLeft: 'auto' }}>
                            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={showModel} className="new-customer-button"> New Customer</Button>
                        </div>
                    </div>

                    <Modal
                        title="Add a New Customer"
                        open={visible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        maskClosable={false}
                        width={600}
                        centered
                        footer={[
                            <Button key="back" onClick={handleCancel} style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} size="large">
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" loading={addLoading} onClick={handleOk} style={{ display: 'inline-block', width: 'calc(50% - 12px)', margin: '0 12px' }} size="large">
                                Add
                            </Button>,
                        ]}>

                        <span style={{ fontSize: '14px', fontWeight: 'normal' }}>Customer Information</span>

                        <Form form={form} name="customerForm" style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '60px' }} >
                            <Form.Item
                                name="companyName"
                                rules={[{ required: true, message: "Please enter the company name" }]}>
                                <Input placeholder="* Company Name" className="form-item" />
                            </Form.Item>

                            <Form.Item name="customerName">
                                <Input placeholder="Customer Name" className="form-item" />
                            </Form.Item>

                            <Form.Item
                                name="customerEmail"
                                rules={[
                                    { type: "email", message: "Invalid email format" },
                                ]}>
                                <Input placeholder="Email" className="form-item" />
                            </Form.Item>

                            <Form.Item name="customerPhone">
                                <Input placeholder="Phone Number" className="form-item" />
                            </Form.Item>

                            <Form.Item
                                name="creditTerm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select credit term!',
                                    },
                                ]}>
                                <Select placeholder="* Credit Term" className="form-item">
                                    <Option value="immidiately">Immediately</Option>
                                    <Option value="30 days">30 days</Option>
                                    <Option value="60 days">60 days</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="note">
                                <Input.TextArea placeholder="Note" style={{ height: '150px' }} />
                            </Form.Item>

                            <Form.Item label="Add Delivery Address" name="enableAddress" valuePropName="checked" labelCol={{ span: 7 }} wrapperCol={{ span: 2, offset: 14 }}>
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) =>
                                    prevValues.enableAddress !== currentValues.enableAddress
                                }>

                                {({ getFieldValue }) => {
                                    const enableAddress = getFieldValue("enableAddress");

                                    return enableAddress ? (
                                        <>
                                            <Form.Item name="customerDeliveryAddress">
                                                <Input placeholder="Delivery Address" className="form-item" />
                                            </Form.Item>

                                            <Form.Item label="Billing Address Same as Delivery Address" name="enableBilling" valuePropName="checked" initialValue={true}
                                                labelCol={{ span: 13 }} wrapperCol={{ span: 2, offset: 8 }}>
                                                <Switch />
                                            </Form.Item>

                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, currentValues) =>
                                                    prevValues.enableBilling !== currentValues.enableBilling
                                                }>
                                                {({ getFieldValue }) => {
                                                    const enableBilling = getFieldValue("enableBilling");

                                                    return enableBilling ? (<></>) : (
                                                        <Form.Item
                                                            name="customerBillingAddress">
                                                            <Input placeholder="Billing Address" className="form-item" />
                                                        </Form.Item>
                                                    );
                                                }}
                                            </Form.Item>
                                        </>
                                    ) : null;
                                }}
                            </Form.Item>
                        </Form>
                    </Modal>

                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 64]}>
                            <Col span={12}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <TeamOutlined />
                                            </Col>
                                            <Col span={18}>
                                                Customers Summary
                                            </Col>
                                        </Row>
                                    }
                                    bordered={false}
                                    style={{ height: 'auto' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
                                            <span style={{ fontSize: '15px' }}>All Customers</span><br />
                                            <span style={{ fontSize: '20px' }}>{customerNo.total}</span>
                                        </Col>
                                        <Col span={8}>
                                            <span style={{ fontSize: '15px' }}>Active</span><br />
                                            <span style={{ fontSize: '20px' }}>{customerNo.active}</span>
                                        </Col>
                                        <Col span={8}>
                                            <span style={{ fontSize: '15px' }}>In-Active</span><br />
                                            <span style={{ fontSize: '20px', color: 'red' }}>{customerNo.inactive}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <ShoppingOutlined />
                                            </Col>
                                            <Col span={18}>
                                                Customers Summary
                                            </Col>
                                        </Row>
                                    }
                                    bordered={false}
                                    style={{ height: 'auto' }}>

                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px' }}>New Customers</span><br />
                                            <span style={{ fontSize: '20px' }}>100</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px' }}>Orders</span><br />
                                            <span style={{ fontSize: '20px' }}>987</span>
                                        </Col>
                                    </Row>

                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Row justify={"end"}>
                            <Col>
                                <Search placeholder="Search Customer" onSearch={onSearch}
                                    enterButton style={{ width: 320, marginBottom: 20 }} 
                                    onChange={onChange}/>
                            </Col>
                        </Row>
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
            </Layout>
        </div >
    );
};

export default CustomerPage;