import React, { useState, useEffect } from "react"
import "./index.scss"
import {
    Form,
    Button,
    Input,
    Modal,
    DatePicker,
    Layout,
    Breadcrumb,
    Card,
    Table,
    Tag,
    Row,
    Col,
    message,
} from 'antd';
import {
    AccountBookOutlined, CarryOutOutlined, EditOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { queryRestockById, updateRestockOrderDetails } from '../../api/api.js'
import moment from "moment";
import dayjs from "dayjs";


const RestockDetailsPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [recordData, setRecordData] = useState({});
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const urlParams = new URLSearchParams(window.location.search);
                const stockBatchDBId = urlParams.get('stockBatchDBId');

                const posts = await queryRestockById(stockBatchDBId);
                if (posts.code === 200) {
                    setRecordData(posts.data[0]);
                    setDataSource(posts.data[0].stockResponsePoList);
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

    const [form] = Form.useForm();
    const [editVisible, setEditVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const showEditModel = () => {
        setEditVisible(true);
    }

    const handleEditOk = async () => {
        form.validateFields().then(async (values) => {
            setEditLoading(true);
            try {
                var queryBody = {
                    "stockBatchDBId": recordData.stockBatchDBId.toString(),
                    "stockBatchDate": moment(values.restockDate.toString()).format("YYYY/MM/DD"),
                    "stockBatchId": values.restockID,
                    "stockBatchNote": values.restockNote,
                }
                const posts = await updateRestockOrderDetails(queryBody);
                if (posts.code === 200) {
                    messageApi.open({
                        type: 'success',
                        content: 'Save Restock Detail Success!',
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
                else {
                    console.log(posts);
                    messageApi.open({
                        type: "error",
                        content: "Save Restock Detail Error!",
                    });
                }
            }
            catch (error) {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: 'Edit Company Error!'
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

    const columns = [
        {
            title: 'Product',
            dataIndex: 'ivtClassName',
            width: "55%",
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
            dataIndex: 'stockNote',
            width: "25%",
        },
        {
            title: 'QTY',
            dataIndex: 'stockOptAmount',
            width: "20%",
        }
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
                                title: 'Restock',
                                href: '/restock',
                            },
                            {
                                title: recordData.stockBatchId,
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        } />

                    <div style={{ display: 'flex', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
                        <div style={{ marginLeft: 'auto' }}>
                            <Button type="default" icon={<EditOutlined />} size="large" onClick={showEditModel} className="edit-customer-details-button" style={{ backgroundColor: "orange", color: "white" }}> Edit</Button>
                        </div>
                    </div>

                    <Modal
                        title="Edit Restock Order"
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

                        <span style={{ fontSize: '14px', fontWeight: 'normal' }}>Restock Info</span>

                        <Form form={form} name="restockForm" style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '60px' }}
                            layout="vertical">
                            <Form.Item
                                label="Restock Date"
                                name="restockDate"
                                rules={[{ required: true, message: "Please enter the Restock Date" }]}
                                initialValue={dayjs(recordData.stockBatchDate)}>
                                <DatePicker
                                    placeholder="Order Date"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Restock ID"
                                name="restockID"
                                rules={[{ required: true, message: "Please enter the Restock ID" }]}
                                initialValue={recordData.stockBatchId}>
                                <Input placeholder="* Restock ID" className="form-item" />
                            </Form.Item>

                            <Form.Item label="Restock Note" name="restockNote" initialValue={recordData.stockBatchNote}>
                                <Input.TextArea
                                    placeholder="Restock Note"
                                    style={{ height: "150px" }}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <CarryOutOutlined />
                                            </Col>
                                            <Col span={18}>
                                                Restock ID: {recordData.stockBatchId}
                                            </Col>
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '250px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Restock Date</span><br />
                                            <span style={{ fontSize: '12px' }}>
                                                {moment(recordData.stockBatchDate).format('DD/MM/YYYY')}
                                            </span>
                                        </Col>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Restock Company Name</span><br />
                                            <span style={{ fontSize: '12px' }}>
                                                {recordData.stockBatchCompany}
                                            </span>
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
                                    style={{ height: 'auto', minHeight: '250px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Restock Note</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.stockBatchNote}</span>
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
                            pagination={false}
                            loading={loading}
                        />
                    </Card>
                </Content>
            </Layout >
        </div>
    );
};

export default RestockDetailsPage;