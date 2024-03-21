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
    CheckOutlined, DeleteOutlined, AccountBookOutlined, CarryOutOutlined, EditOutlined, DownloadOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { getOrderDetailByDBId, updateOrderStatus, deleteOrderById } from '../../api/api.js'
import moment from "moment";
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from './document'


const OrderDetailsPage = () => {
    const { Content } = Layout;
    const [reverseForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [productTotal, setProductTotal] = useState(0.00);
    const [shippingFee, setShippingFee] = useState(0.00);
    const [prevBalance, setPrevBalance] = useState(0.00);
    const [allTotal, setAllTotal] = useState(0.00);

    const [recordData, setRecordData] = useState({});
    const [completeVisible, setCompleteVisible] = useState(false);
    const showCompleteModel = () => {
        setCompleteVisible(true);
    }

    const [reverseVisible, setReverseVisible] = useState(false);
    const showReverseModel = () => {
        setReverseVisible(true);
    }

    const [deleteVisible, setDeleteVisible] = useState(false);
    const showDeleteModel = () => {
        setDeleteVisible(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const urlParams = new URLSearchParams(window.location.search);
                const orderDBId = urlParams.get('orderDBId');

                const posts = await getOrderDetailByDBId(orderDBId);
                if (posts.code === 200) {
                    //console.log(posts.data);
                    setRecordData(posts.data);
                    setDataSource(posts.data.orderIvtPoList);
                    setProductTotal(parseFloat(posts.data.totalPrice) - parseFloat(posts.data.orderShippingFee ?? 0) - parseFloat(posts.data.orderPreBalance ?? 0));
                    setShippingFee(parseFloat(posts.data.orderShippingFee ?? 0));
                    setPrevBalance(parseFloat(posts.data.orderPreBalance ?? 0));
                    setAllTotal(parseFloat(posts.data.totalPrice));
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

    const handleDeleteOk = async () => {
        try {
            const posts = await deleteOrderById(recordData.orderDBId);
            if (posts.code === 200) {
                window.open(`/orders`, '_self');
            }
            else {
                messageApi.open({
                    type: 'error',
                    content: 'Delete Order Error!'
                })
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: 'Delete Order Error!'
            })
        }
    }

    const handleDeleteCancel = () => {
        setDeleteVisible(false);
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
                            <NavLink to='/ivtDetailPage' state={{ "prePage": "inventory", "ivtId": JSON.stringify(record.ivtId) }} >{ivtId === null ? "" : ivtId.toString()}</NavLink>
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
                if (_ === null) {
                    return 0.00.toFixed(2);
                }
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
    ];

    const renderDateAndTag = (text) => {
        const originalDate = moment(text);
        const currentDate = moment();
        let isOverDue = true;

        if (recordData.customerInterPo === null || "immediately" === recordData.customerInterPo?.creditTerm || recordData.customerInterPo === undefined) {
            isOverDue = currentDate.isAfter(originalDate);
        } else if (recordData.customerInterPo.creditTerm.includes("30")) {
            isOverDue = currentDate.isAfter(originalDate.add(30, 'day'));
        } else if (recordData.customerInterPo.creditTerm.includes("60")) {
            isOverDue = currentDate.isAfter(originalDate.add(60, 'day'));
        }

        return (
            <span style={{ fontSize: '12px' }}>
                <span>{moment(text).format('DD/MM/YYYY')}  </span>
                {(recordData.orderStatus === "processing" && isOverDue) ? <Tag color="red"> overdue</Tag> : null}
            </span>
        );
    };

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
                            {
                                recordData.orderStatus === "processing" ? (
                                    <>
                                        <PDFDownloadLink
                                            document={<MyDocument data={recordData} />}
                                            fileName={recordData.orderId + ".pdf"}>
                                            {({ blob, url, loading, error }) => (
                                                <Button
                                                    icon={<DownloadOutlined />}
                                                    size="large"
                                                    className="edit-customer-details-button"
                                                    style={{ backgroundColor: "deepskyblue", color: "white" }}>
                                                    {loading ? 'Loading...' : 'Print'}
                                                </Button>
                                            )}
                                        </PDFDownloadLink>
                                        <NavLink to={`/editOrder?orderDBId=${recordData.orderDBId}`}>
                                            <Button icon={<EditOutlined />} size="large" className="edit-customer-details-button"
                                                style={{ backgroundColor: "orange", color: "white" }}>
                                                Edit
                                            </Button>
                                        </NavLink>
                                        <Button icon={<CheckOutlined />} size="large" className="edit-customer-details-button" onClick={showCompleteModel}
                                            style={{ backgroundColor: "green", color: "white" }}> Complete</Button>
                                        <Button icon={<DeleteOutlined />} size="large" className="edit-customer-details-button" onClick={showDeleteModel}
                                            style={{ backgroundColor: "red", color: "white", }}> Delete</Button>
                                    </>
                                ) : (
                                    <>
                                        <PDFDownloadLink
                                            document={<MyDocument data={recordData} />}
                                            fileName={recordData.orderId + ".pdf"}>
                                            {({ blob, url, loading, error }) => (
                                                <Button
                                                    icon={<DownloadOutlined />}
                                                    size="large"
                                                    className="edit-customer-details-button"
                                                    style={{ backgroundColor: "deepskyblue", color: "white" }}>
                                                    {loading ? 'Loading...' : 'Print'}
                                                </Button>
                                            )}
                                        </PDFDownloadLink>
                                        <Button icon={<DeleteOutlined />} size="large" className="edit-customer-details-button" disabled={recordData.orderStatus === "reversed"} onClick={showReverseModel}
                                            style={{ backgroundColor: "red", color: "white", }}> Reverse</Button>
                                    </>
                                )
                            }
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
                                            {recordData.isCashSale === true ?
                                                <>
                                                    <Col span={14}>
                                                        Order ID: {recordData.orderId}
                                                    </Col>
                                                    <Col span={4}>
                                                        <Tag color={"green"}> cash sale </Tag>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Tag color={recordData.orderStatus === "processing" ? 'orange' :
                                                            (recordData.orderStatus === "reversed" ? 'red' : 'green')}> {recordData.orderStatus}</Tag>
                                                    </Col>
                                                </> :
                                                <>
                                                    <Col span={18}>
                                                        Order ID: {recordData.orderId}
                                                    </Col>
                                                    <Col span={4}>
                                                        <Tag color={recordData.orderStatus === "processing" ? 'orange' :
                                                            (recordData.orderStatus === "reversed" ? 'red' : 'green')}> {recordData.orderStatus}</Tag>
                                                    </Col>
                                                </>
                                            }
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '350px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Order Date</span><br />
                                            <span style={{ fontSize: '12px' }}>{renderDateAndTag(recordData.orderDate)}</span>
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
                        title="Do you want to delete this order?"
                        open={deleteVisible}
                        onOk={handleDeleteOk}
                        onCancel={handleDeleteCancel}
                        maskClosable={false}
                        width={600}
                        centered>
                        <span style={{ fontSize: '14px', fontWeight: 'normal' }}>* Note:  Delete Order will remove this order from database</span>
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
                            pagination={false}
                            loading={loading}
                        />
                        <Row gutter={[16, 16]} style={{ margin: '20px' }}>
                            <Col span={6} offset={12}><span className="item-span">SUBTOTAL</span></Col>
                            <Col span={6}><span className="item-span" style={{ paddingRight: "8px" }}>{productTotal.toFixed(2)}</span></Col>

                            <Col span={6} offset={12}><span className="item-span">SHIPPING</span></Col>
                            <Col span={6}><span className="item-span" style={{ paddingRight: "8px" }}>{shippingFee.toFixed(2)}</span></Col>

                            <Col span={6} offset={12}><span className="item-span">PREVIOUS BALANCE</span></Col>
                            <Col span={6}><span className="item-span" style={{ paddingRight: "8px" }}>{prevBalance.toFixed(2)}</span></Col>

                            <Col span={6} offset={12}><span className="item-span">TOTAL</span></Col>
                            <Col span={6}><span className="item-span" style={{ paddingRight: "8px" }}>{allTotal.toFixed(2)}</span></Col>
                        </Row>
                    </Card>
                </Content>
            </Layout >
        </div>
    );
};

export default OrderDetailsPage;