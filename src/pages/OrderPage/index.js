import React, { useEffect, useState } from "react";
import "./index.scss"

import {
    Button,
    Breadcrumb,
    Layout,
    Row,
    Col,
    message,
    Flex,
    Tabs
} from 'antd'
import { PlusOutlined, AccountBookOutlined, MoneyCollectOutlined, SearchOutlined } from '@ant-design/icons'
import StatisticCard from "@/components/StatisticCard/StatisticCard";
import { Link } from 'react-router-dom';
import { getOrderSummary } from "../../api/api.js";
import StockSaleTab from "./stocksaletab";
import SearchTab from "./searchtab";
import CashSaleTab from "./cashsaletab";


const OrderPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();
    const [orderNo, setOrderNo] = useState([]);

    const items = [
        {
            key: "1",
            label: "Stock Sale",
            children: <StockSaleTab />,
            icon: <AccountBookOutlined />,
            destroyInactiveTabPane: true,
        },
        {
            key: "2",
            label: "Cash Sale",
            children: <CashSaleTab />,
            icon: <MoneyCollectOutlined />,
            destroyInactiveTabPane: true,
        },
        {
            key: "3",
            label: "Search",
            children: <SearchTab />,
            icon: <SearchOutlined />,
            destroyInactiveTabPane: true,
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getOrderSummary();
                if (res.code === 200) {
                    setOrderNo([
                        {
                            title: "All Order",
                            number: res.data.totalOrderCount,
                        },
                        {
                            title: "Processing",
                            number: res.data.processingOrderCount,
                            style: { color: "orange" },
                        },
                        {
                            title: "Completed",
                            number: res.data.completedOrderCount,
                            style: { color: "green" },
                        },
                        {
                            title: "Reversed",
                            number: res.data.reversedOrderCount,
                            style: { color: "red" },
                        }
                    ]);
                } else {
                    messageApi.open({
                        type: "error",
                        content: "Loading Order Summary Error!",
                    });
                }
            } catch (error) {
                console.log(error);
                messageApi.open({
                    type: "error",
                    content: "Loading Order Summary Error!",
                });
            }
        };

        fetchData();
    }, [messageApi]);

    // TODO: fetch data from api
    const orderSummary = [
        {
            title: "New Customers",
            number: "100",
        },
        {
            title: "Orders",
            number: "999",
        },
    ];

    const handleTabChange = (key) => {
        localStorage.setItem("settingsTabKey", key);
    };

    const selectedKey = localStorage.getItem("settingsTabKey") ?? 1;

    return (
        <div className="ivt-layout">
            <Layout>
                {contextHolder}
                <Content style={{ margin: "10px" }}>
                    <div className="customer-container ">
                        <Breadcrumb
                            separator=">"
                            items={[
                                {
                                    title: "Home",
                                    href: "/",
                                },
                                {
                                    title: "Orders",
                                    href: "",
                                },
                            ]}
                        />

                        <Flex align="flex-end" justify="flex-end">
                            <Link to="/neworder">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                    className="new-customer-button">
                                    New Order
                                </Button>
                            </Link>
                        </Flex>

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <StatisticCard title="Order Summary" data={orderNo} spanNumber={6} />
                            </Col>
                            <Col span={12}>
                                <StatisticCard title="Order Summary"
                                    data={orderSummary}
                                    spanNumber={12}
                                />
                            </Col>
                        </Row>
                    </div>
                </Content>

                <Tabs
                    type="card"
                    size="large"
                    centered
                    defaultActiveKey={selectedKey}
                    items={items}
                    onChange={handleTabChange}
                    tabBarGutter={10}
                />

            </Layout>
        </div>
    );
};

export default OrderPage;