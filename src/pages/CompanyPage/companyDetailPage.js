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
    EditOutlined, UserOutlined, BarsOutlined
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { getRestockCompanyById, updateCompanyById } from '../../api/api.js'
import moment from "moment";
import dayjs from "dayjs";


const CompanyDetailsPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');

    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const [recordData, setRecordData] = useState({});
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await getRestockCompanyById(companyId);
                if (posts.code === 200) {
                    setRecordData(posts.data);
                    setDataSource(posts.data.stockBatchPoList);
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


    const [editVisible, setEditVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const showEditModel = () => {
        setEditVisible(true);
    }


    const handleEditOk = async () => {
        form.validateFields().then(async (values) => {
            setEditLoading(true);
            try {
                const queryBody = {
                    "companyId": companyId,
                    "companyName": values.companyName,
                    "companyEmail": values.companyEmail,
                    "companyPhone": values.companyPhone
                }
                
                const posts = await updateCompanyById(queryBody);
                if (posts.code === 200) {
                    setEditVisible(false);
                    form.resetFields();
                    messageApi.open({
                        type: 'success',
                        content: 'Edit Company Success!',
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: 'Edit Company Error!'
                    })
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
            title: "Restock Date",
            dataIndex: "stockBatchDate",
            width: "20%",
            render: (text) => {
                return (
                    <>
                        <span>{moment(text).format('DD/MM/YYYY')}  </span>
                    </>
                )
            }
        },
        {
            title: "Restock Id",
            dataIndex: "stockBatchId",
            width: "20%",
            key: "stockBatchId",
            render: (restockId, record) => {
                const url = `/restockDetails?stockBatchDBId=${record.stockBatchDBId}`;
                return (
                    <NavLink to={url}>
                        {restockId}
                    </NavLink>
                );
            },
        },
        {
            title: "Notes",
            dataIndex: "stockBatchNote",
            width: "30%",
        },
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
                                title: 'Restock Company',
                                href: '/company',
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
                        </div>
                    </div>

                    <Modal
                        title="Edit Company"
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

                        <span style={{ fontSize: '14px', fontWeight: 'normal' }}>Company Information</span>

                        <Form form={form} name="customerForm" style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '60px' }}
                            layout="vertical">
                            <Form.Item
                                label="Company Name"
                                name="companyName"
                                rules={[{ required: true, message: "Please enter the company name" }]}
                                initialValue={recordData.companyName}>
                                <Input placeholder="* Company Name" className="form-item" />
                            </Form.Item>

                            <Form.Item
                                label="Company Email"
                                name="companyEmail"
                                initialValue={recordData.companyEmail}>
                                <Input placeholder="Email" className="form-item" />
                            </Form.Item>

                            <Form.Item label="Phone Number" name="companyPhone" initialValue={recordData.companyPhone}>
                                <Input placeholder="Phone Number" className="form-item" />
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
                                                <UserOutlined />
                                            </Col>
                                            <Col span={18}>
                                                {recordData.companyName}
                                            </Col>
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Company Name</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.companyName}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    title={
                                        <Row>
                                            <Col span={2}>
                                                <BarsOutlined />
                                            </Col>
                                            <Col span={18}>
                                                Details
                                            </Col>
                                        </Row>}
                                    bordered={false}
                                    style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Email</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.companyEmail}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Phone</span><br />
                                            <span style={{ fontSize: '12px' }}>{recordData.companyPhone}</span>
                                        </Col>
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
                        />
                    </Card>
                </Content>
            </Layout >
        </div>
    );
};

export default CompanyDetailsPage;