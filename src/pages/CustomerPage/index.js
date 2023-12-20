import React, { useEffect, useState } from "react"
import "./index.scss"

import { Card, Breadcrumb, Table, Tag, Layout, Row, Col } from "antd";
import {
    TeamOutlined, ShoppingOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { customerList } from '../../api/api.js'

const CustomerPage = () => {
    const { Content } = Layout;

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchParams, setSearchParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })

    useEffect(() => {
        const fetchDataAndUpdateState = async () => {
            try {
                setDataSource([]);
                setLoading(true);
                const posts = await customerList(searchParams);
                console.log(posts);
                if (posts['code'] === 200) {
                    setDataSource(JSON.parse(JSON.stringify(posts.data)));
                    setSearchParams({
                        ...searchParams,
                        pagination: {
                            ...searchParams.pagination,
                            total: posts['data'].length,
                          },
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        };

        fetchDataAndUpdateState();
    }, [JSON.stringify(searchParams)])

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
                return <NavLink>{customerName}</NavLink>
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
                                        <span style={{ fontSize: '20px' }}>{dataSource.filter(obj => obj.delFlag === "active").length}</span>
                                    </div>}
                                    {<div key="inactive-customers" style={{ paddingRight: '10px', position: 'absolute', top: '50%', right: '3%' }}>
                                        <span style={{ fontSize: '15px' }}>In-Active</span><br />
                                        <span style={{ fontSize: '20px', color: 'red' }}>{dataSource.filter(obj => obj.delFlag !== "active").length}</span>
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