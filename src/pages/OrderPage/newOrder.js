import React, { useState, useEffect } from "react"
import "./index.scss"
import {
    Layout,
    Breadcrumb,
    Button,
    message,
    Dropdown,
    Card,
    Row,
    Col,
    Input,
    DatePicker
} from 'antd';
import {
    EditOutlined, DeleteOutlined
} from '@ant-design/icons'
import moment from "moment";


const NewOrderPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();

    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState(moment()); // 使用 null 表示没有选择日期
    const [customerOrderNo, setCustomerOrderNo] = useState('');

    const handleOrderIdChange = (e) => {
        setOrderId(e.target.value);
      };
    
      const handleOrderDateChange = (date) => {
        setOrderDate(date);
      };
    
      const handleCustomerOrderNoChange = (e) => {
        setCustomerOrderNo(e.target.value);
      };

    const onMenuClick = (e) => {
        console.log('click', e.key);
    };

    const buttonItems = [
        {
            key: '1',
            label: 'Save and New',
        },
        {
            key: '2',
            label: 'Save and Close',
        },
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
                                title: 'Orders',
                                href: '/orders',
                            },
                            {
                                title: "New Order"
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        } />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                        <Button danger icon={<DeleteOutlined />} size="large" className="edit-customer-details-button" > Cancel </Button>
                        <Dropdown.Button type="default" icon={<EditOutlined />} size="large" className="edit-customer-details-button" onClick={onMenuClick}
                            menu={{ items: buttonItems, onClick: onMenuClick }} > Save and New
                        </Dropdown.Button>
                    </div>


                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card bordered={false} style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}><span className="item-span">* Order ID</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Order ID"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={orderId}
                                                onChange={handleOrderIdChange}
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">* Order Date</span></Col>
                                        <Col span={18}>
                                            <DatePicker
                                                format='YYYY/MM/DD'
                                                value={orderDate}
                                                onChange={handleOrderDateChange}
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">Customer Order No</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Customer Order No"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={customerOrderNo}
                                                onChange={handleCustomerOrderNoChange}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card bordered={false} style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>

                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                </Content>
            </Layout >
        </div>
    );
};

export default NewOrderPage;