import React, { useEffect, useState } from "react"
import "./index.scss"

import { Select, Card, Breadcrumb, Form, Button, Table, Tag, Space, Input, Layout, Drawer, Row, Col } from "antd";
import {
    TeamOutlined, ShoppingOutlined
} from '@ant-design/icons'
//import img404 from '@/assets/error.png'
import { http } from "@/utils";
import { NavLink } from "react-router-dom";

const CustomerPage = () => {
    const { Content } = Layout;

    const [searchParas, setSearchParas] = useState({
        pageIndex: 1,
        pageSize: 10
    })

    const dataSource = [
        {
            customerId: '1',
            name: 'aaa',
            companyName: 'AA Pty Ltd',
            email: 'aa@aa.com',
            phone: '0123-456-789',
            orders: '1',
            address: 'aa Road, AA, VIC, 3000',
            status: 'Active',
        },
        {
            customerId: '2',
            name: 'bbb',
            companyName: 'BB Pty Ltd',
            email: 'aa@aa.com',
            phone: '0123-456-789',
            orders: '1',
            address: 'bb Road, BB, VIC, 3000',
            status: 'Active',
        },
        {
            customerId: '3',
            name: 'ccc',
            companyName: 'cc Pty Ltd',
            email: 'aa@aa.com',
            phone: '0123-456-789',
            orders: '1',
            address: 'cc Road, CC, VIC, 3000',
            status: 'Active',
        },
        {
            customerId: '4',
            name: 'ddd',
            companyName: 'dd Pty Ltd',
            email: 'aa@aa.com',
            phone: '0123-456-789',
            orders: '1',
            address: 'dd Road, DD, VIC, 3000',
            status: 'Active',
        },
        {
            customerId: '5',
            name: 'eee',
            companyName: 'ee Pty Ltd',
            email: 'aa@aa.com',
            phone: '0123-456-789',
            orders: '1',
            address: 'ee Road, EE, VIC, 3000',
            status: 'Inactive',
        },
        {
            customerId: '6',
            name: 'fff',
            companyName: 'ff Pty Ltd',
            email: 'aa@aa.com',
            phone: '0123-456-789',
            orders: '1',
            address: 'ff Road, FF, VIC, 3000',
            status: 'Inactive',
        },
    ];

    const handlePageChange = (pageIndex, pageSize) => {
        setSearchParas({
            ...searchParas,
            pageIndex,
            pageSize
        })
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            width: 220,
            key: 'customerId',
            render: (customerName, record) => {
                return <NavLink>{customerName}</NavLink>
            }
        },
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
             ],
            render: (status) => (
                <span>
                    <Tag color={status === "Active" ? 'green' : 'volcano'}> {status} </Tag>
                </span>
            ),
        }
    ]

    return (
        <div className="ivt-layout">
            <Layout>
                <Content>
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
                        style={
                            { marginBottom: '20px' }
                        }
                    />
                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 64]}>
                            <Col span={12}>
                                <Card
                                    title={
                                        <div><TeamOutlined /> Customers Summary</div>
                                    }
                                    bordered={false}
                                    style={{ height: '200px' }}>
                                    {<div key="all-customers" style={{ paddingLeft: '10px', position: 'absolute', top: '50%', left: '3%' }}>
                                        <span style={{ fontSize: '15px' }}>All Customers</span><br />
                                        <span style={{ fontSize: '20px' }}>{dataSource.length}</span>
                                    </div>}
                                    {<div key="active-customers" style={{ paddingRight: '10px', position: 'absolute', top: '50%', left: '45%' }}>
                                        <span style={{ fontSize: '15px' }}>Active</span><br />
                                        <span style={{ fontSize: '20px' }}>{dataSource.filter(obj => obj.status === "Active").length}</span>
                                    </div>}
                                    {<div key="inactive-customers" style={{ paddingRight: '10px', position: 'absolute', top: '50%', right: '3%' }}>
                                        <span style={{ fontSize: '15px' }}>In-Active</span><br />
                                        <span style={{ fontSize: '20px', color: 'red' }}>{dataSource.filter(obj => obj.status !== "Active").length}</span>
                                    </div>}
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    title={
                                        <div><ShoppingOutlined /> Cusomters Summary </div>
                                    }
                                    bordered={false}
                                    style={{ height: '200px' }}>
                                    {<div key="new-customers" style={{ paddingLeft: '10px', position: 'absolute', top: '50%', left: '3%' }}>
                                        <span style={{ fontSize: '15px' }}>New Customers</span><br />
                                        <span style={{ fontSize: '20px' }}>100</span>
                                    </div>}
                                    {<div key="total-orders" style={{ paddingRight: '10px', position: 'absolute', top: '50%', right: '10%' }}>
                                        <span style={{ fontSize: '15px' }}>Orders</span><br />
                                        <span style={{ fontSize: '20px' }}>987</span>
                                    </div>}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Table
                            rowKey={"id"}
                            columns={columns}
                            dataSource={dataSource}
                            pagination={{
                                position: ['bottomCenter'],
                                current: searchParas.pageIndex,
                                pageSize: searchParas.pageSize,
                                total: dataSource.length,
                                onChange: handlePageChange
                            }}
                        />
                    </Card>
                </Content>
            </Layout>
        </div >
    );
};

export default CustomerPage;