import React, { useState, useEffect } from "react"
import "./index.scss"
import {
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
    AccountBookOutlined, CarryOutOutlined,
} from '@ant-design/icons'
import { NavLink } from "react-router-dom";
import { queryRestockById } from '../../api/api.js'
import moment from "moment";


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