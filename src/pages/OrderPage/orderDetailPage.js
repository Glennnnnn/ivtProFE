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
} from 'antd';
import {
    CheckOutlined, DeleteOutlined, AccountBookOutlined, CarryOutOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { getOrderDetailByDBId, updateOrderStatus } from '../../api/api.js'
import moment from "moment";


const OrderDetailsPage = () => {
    const { Content } = Layout;
    const [reverseForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [recordData, setRecordData] = useState({});
    const [completeVisible, setCompleteVisible] = useState(false);
    const showCompleteModel = () => {
        setCompleteVisible(true);
    }

    const [reverseVisible, setReverseVisible] = useState(false);
    const showReverseModel = () => {
        setReverseVisible(true);
    }

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
    const searchParams = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    })

    const handleCompleteOk = async () => {
        try {
            const posts = await updateOrderStatus(recordData.orderDBId, "completed", "");
            if (posts.code === 200) {
                setCompleteVisible(false);
                window.location.reload();
            }
            else {
                messageApi.open({
                    type: 'error',
                    content: 'Complete Order Error!'
                })
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: 'Complete Order Error!'
            })
        }
    }

    const handleCompleteCancel = () => {
        setCompleteVisible(false);
    }

    const handleReverseOk = async () => {
        reverseForm.validateFields().then(async (values) => {
            try {
                const posts = await updateOrderStatus(recordData.orderDBId, "reversed", values.reason);
                if (posts.code === 200) {
                    setReverseVisible(false);
                    window.location.reload();
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Reverse Order Error!'
                    })
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Reverse Order Error!'
                })
            }
        }).catch((errorInfo) => {
            messageApi.open({
                type: 'error',
                content: 'Please fill in the required fields!'
            })
        })

    }

    const handleReverseCancel = () => {
        setReverseVisible(false);
        reverseForm.resetFields();
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'ivtClassName',
            width: "45%",
            render: (ivtId, record) => {
                return (
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <NavLink to='/ivtDetailPage' state={{ "prePage": "inventory", "ivtId": JSON.stringify(record.ivtId) }} >{ivtId.toString()}</NavLink>
                        </Col>
                        <Col span={12}>
                            <span style={{ whiteSpace: 'pre-wrap' }}>
                                {record.tags.map((tag) => {
                                    if (tag !== null) {
                                        return (
                                            <Tag color="green" key={tag.tagName}>
                                                {tag.tagName + ': ' + tag.tagValue}
                                            </Tag>
                                        );
                                    }
                                })}
                            </span>
                        </Col>
                    </Row>
                )
            }
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
                            <Button icon={<CheckOutlined />} size="large" className="edit-customer-details-button" disabled={recordData.orderStatus !== "processing"} onClick={showCompleteModel}
                                style={{ backgroundColor: recordData.orderStatus !== "processing" ? "" : "green", color: "white" }}> Complete</Button>
                            <Button icon={<DeleteOutlined />} size="large" className="edit-customer-details-button" disabled={recordData.orderStatus === "reversed"} onClick={showReverseModel}
                                style={{ backgroundColor: recordData.orderStatus === "reversed" ? "" : "red", color: "white" }}> Reverse</Button>
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
                                            <span style={{ fontSize: '12px' }}>
                                                {
                                                    recordData.customerInterPo === null ||
                                                        recordData.customerInterPo === undefined ||
                                                        recordData.customerInterPo.customerId === undefined ||
                                                        recordData.customerInterPo.customerId === null ?
                                                        (<>{recordData.orderCompanyName}</>) : (
                                                            <>
                                                                <NavLink to={`/customerDetails?customerId=${recordData.customerInterPo.customerId.toString()}`}>
                                                                    {recordData.orderCompanyName}
                                                                </NavLink>
                                                            </>
                                                        )
                                                }
                                            </span>
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
                                        {null === recordData.reverseReason ?
                                            <Col span={24}>
                                                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Order Note</span><br />
                                                <span style={{ fontSize: '12px' }}>{recordData.orderNote}</span>
                                            </Col> :
                                            <>
                                                <Col span={24}>
                                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Order Note</span><br />
                                                    <span style={{ fontSize: '12px' }}>{recordData.orderNote}</span>
                                                </Col>
                                                <Col span={24}>
                                                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Reverse Reason</span><br />
                                                    <span style={{ fontSize: '12px' }}>{recordData.reverseReason}</span>
                                                </Col>
                                            </>
                                        }

                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Modal
                        title="Do you want to complete this order?"
                        open={completeVisible}
                        onOk={handleCompleteOk}
                        onCancel={handleCompleteCancel}
                        maskClosable={false}
                        width={600}
                        centered>
                        <span style={{ fontSize: '14px', fontWeight: 'normal' }}>* Note:  You cannot move this order to processing after complete</span>
                    </Modal>

                    <Modal
                        title="Reverse this order"
                        open={reverseVisible}
                        onOk={handleReverseOk}
                        onCancel={handleReverseCancel}
                        maskClosable={false}
                        width={600}
                        centered
                        footer={[
                            <Button key="back" onClick={handleReverseCancel} style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} size="large">
                                Cancel
                            </Button>,
                            <Button key="submit" danger onClick={handleReverseOk} style={{ display: 'inline-block', width: 'calc(50% - 12px)', margin: '0 12px' }} size="large">
                                Reverse
                            </Button>,
                        ]}>
                        <span style={{ fontSize: '14px', fontWeight: 'normal' }}>* Note:  You cannot change this order status after reverse</span>

                        <Form form={reverseForm} name="reverseForm" style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '60px' }}
                            layout="vertical">
                            <Form.Item label="Reason" name="reason">
                                <Input.TextArea placeholder="Reason" style={{ height: '150px' }} />
                            </Form.Item>
                        </Form>
                    </Modal>

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