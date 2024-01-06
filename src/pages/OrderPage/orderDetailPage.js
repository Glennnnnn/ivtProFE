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
    CheckOutlined, DeleteOutlined, UserOutlined, AccountBookOutlined, CarryOutOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { getOrderDetailByDBId } from '../../api/api.js'
import moment from "moment";


const OrderDetailsPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [recordData, setRecordData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const urlParams = new URLSearchParams(window.location.search);
                const orderDBId = urlParams.get('orderDBId');

                const posts = await getOrderDetailByDBId(orderDBId);
                if (posts.code === 200) {
                    setRecordData(posts.data);
                    setDataSource(posts.data.orderIvtPoList);
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

    const [dataSource, setDataSource] = useState([]);
    const [searchParams, setSearchParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    })

    const columns = [
        {
            title: 'Product',
            dataIndex: 'ivtId',
            width: "45%",
            // render: (ivtId, record) => {
            //     return <NavLink>{ivtId}</NavLink>
            // }
        },
        {
            title: 'Description',
            dataIndex: 'orderIvtDesc',
            width: "25%",
        },
        {
            title: 'QTY',
            dataIndex: 'orderIvtQty',
            width: "10%",
        },
        {
            title: 'Price(AUD)',
            dataIndex: 'orderIvtPrice',
            width: "10%",
            render: (_, record) => {
                const formattedTotal = _.toFixed(2);
                return ` ${formattedTotal}`;
            },
        },
        {
            title: 'Total(AUD)',
            dataIndex: 'orderIvtTotal',
            width: "10%",
            render: (_, record) => {
                const formattedTotal = _.toFixed(2);
                return ` ${formattedTotal}`;
            },
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
                                title: 'Orders',
                                href: '/orders',
                            },
                            {
                                title: recordData.orderId,
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        } />

                    <div style={{ display: 'flex', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
                        <div style={{ marginLeft: 'auto' }}>
                            <Button icon={<CheckOutlined />} size="large" className="edit-customer-details-button"
                                style={{ backgroundColor: "green", color: "white" }}> Complete</Button>
                            <Button icon={<DeleteOutlined />} size="large" className="edit-customer-details-button" disabled={false}
                                style={{ backgroundColor: "red", color: "white" }}> Reverse</Button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <CarryOutOutlined />
                                            </Col>
                                            <Col span={16}>
                                                Order ID: {recordData.orderId}
                                            </Col>
                                            <Col span={6}>
                                                <Tag color={recordData.orderStatus === "processing" ? 'orange' :
                                                    (recordData.orderStatus === "reversed" ? 'red' : 'green')}> {recordData.orderStatus}</Tag>
                                            </Col>
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '350px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Order Date</span><br />
                                            <span style={{ fontSize: '12px' }}>{moment(recordData.orderDate).format('DD/MM/YYYY')}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Customer Order No</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.customerOrderNo}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Company Name</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.orderCompanyName}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Customer Name</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.orderCustomerName}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Phone</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.orderCustomerPhone}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Email</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.orderCustomerEmail}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Delivery Address</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.orderDeliveryAddress}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Billing Address</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.orderBillingAddress}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
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
                                    style={{ height: 'auto', minHeight: '350px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Order Note</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.orderNote}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Table
                            rowKey={"ivtId"}
                            columns={columns}
                            dataSource={dataSource}
                            pagination={searchParams.pagination}
                            loading={loading}
                        />
                    </Card>
                </Content>
            </Layout >
        </div>
    );
};

export default OrderDetailsPage;