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
    DatePicker,
    Select,
    Switch
} from 'antd';
import {
    EditOutlined, DeleteOutlined
} from '@ant-design/icons'
import moment from "moment";
import { searchCustomerList } from "@/api/api.js";


const NewOrderPage = () => {
    const { Content } = Layout;
    const { Option } = Select;
    const [messageApi, contextHolder] = message.useMessage();
    const today = moment();

    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState(null);
    const [customerOrderNo, setCustomerOrderNo] = useState('');
    const [orderNote, setOrderNote] = useState('');

    const [showCustomer, setShowCustomer] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState();

    const handleOrderIdChange = (e) => {
        setOrderId(e.target.value);
    };

    const handleOrderDateChange = (date) => {
        setOrderDate(date);
    };

    const handleCustomerOrderNoChange = (e) => {
        setCustomerOrderNo(e.target.value);
    };

    const handleOrderNoteChange = (e) => {
        setOrderNote(e.target.value);
    }

    const handleSelectedCustomer = (e) => {
        setSearchValue('');
        setSelectedCustomer(e);
    }

    const onMenuClick = (e) => {
        console.log('click', e.key);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const posts = await searchCustomerList(searchValue);
                if (posts.code === 200) {
                    setCustomerList(posts.data.customerInterPos);
                } else {
                    messageApi.open({
                        type: "error",
                        content: "Loading Customers Error!",
                    });
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchValue]);

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
                                                defaultValue={today}
                                                placeholder="Order Date"
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">Order Note</span></Col>
                                        <Col span={18}>
                                            <Input.TextArea
                                                placeholder="Order Note"
                                                style={{ minHeight: "150px" }}
                                                value={orderNote}
                                                onChange={handleOrderNoteChange}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card bordered={false} style={{ height: 'auto', minHeight: '220px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}><span className="item-span">Customer Order No</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Customer Order No"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={customerOrderNo}
                                                onChange={handleCustomerOrderNoChange}
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">New Customer</span></Col>
                                        <Col span={18}>
                                            <Switch value={showCustomer} onChange={(value) => setShowCustomer(value)} />
                                        </Col>

                                        {
                                            showCustomer ? (<></>) : (<>
                                                <Col span={6}><span className="item-span">Existing Customer</span></Col>
                                                <Col span={18}>
                                                    <Select
                                                        showSearch
                                                        value={selectedCustomer}
                                                        placeholder="Search for customer"
                                                        onSearch={(value) => setSearchValue(value)}
                                                        onChange={handleSelectedCustomer}
                                                        optionLabelProp="label"
                                                        loading={loading}
                                                        defaultActiveFirstOption={false}
                                                        filterOption={false}
                                                        style={{ width: '100%' }}>
                                                        {customerList.map((customer) => (
                                                            <Option key={customer.customerId.toString()} value={customer.customerId.toString()} label={customer.companyName.toString()}>
                                                                <div>{`${customer.companyName}`}</div>
                                                                {customer.customerName && <div>{`Name: ${customer.customerName}`}</div>}
                                                                {customer.customerPhone && <div>{`Phone: ${customer.customerPhone}`}</div>}
                                                                {customer.customerEmail && <div>{`Email: ${customer.customerEmail}`}</div>}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Col>
                                            </>
                                            )
                                        }

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