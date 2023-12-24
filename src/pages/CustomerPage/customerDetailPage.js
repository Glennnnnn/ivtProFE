import React, { useEffect, useState } from "react"
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
} from 'antd';
import {
    EditOutlined, DeleteOutlined, UserOutlined, CarOutlined, AccountBookOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { useLocation } from 'react-router-dom';


const CustomerDetailsPage = () => {
    const { Content } = Layout;

    const [form] = Form.useForm();
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
                            <Button type="default" icon={<EditOutlined />} size="large" className="edit-customer-details-button" > Edit</Button>
                            <Button danger icon={<DeleteOutlined />} size="large" className="edit-customer-details-button"> Inactive</Button>
                        </div>
                    </div>

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