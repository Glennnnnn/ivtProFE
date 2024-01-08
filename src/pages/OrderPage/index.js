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
    Tag,
    Table,
    Card,
    Input
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import StatisticCard from "@/components/StatisticCard/StatisticCard";
import { Link, NavLink } from 'react-router-dom';
import { orderList, getOrderSummary } from "../../api/api.js";
import moment from "moment";
import dayjs from 'dayjs';


const OrderPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();
    const [orderNo, setOrderNo] = useState([]);

    const [loading, setLoading] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [searchParams, setSearchParams] = useState({
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
	});
	const [searchName, setSearchName] = useState("");

    const fetchDataAndUpdateState = async () => {
		try {
			setDataSource([]);
			setLoading(true);
			const posts = await orderList(searchParams);
			if (posts.code === 200) {
				setDataSource(posts.data.responsePoList);
				setSearchParams({
					...searchParams,
					pagination: {
						...searchParams.pagination,
						total: posts.data.count,
					},
				});
			} else {
				messageApi.open({
					type: "error",
					content: "Loading Orders Error!",
				});
			}
		} catch (error) {
			console.log(error);
			messageApi.open({
				type: "error",
				content: "Loading Orders Error!",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDataAndUpdateState();
	}, [JSON.stringify(searchParams)]);

	const handlePageChange = (pagination, filters, sorter) => {
		if (pagination.pageSize !== searchParams.pagination?.pageSize) {
			console.log("page size changed");
			pagination.current = 1;
			setDataSource([]);
		}

		setSearchParams({
			pagination,
			filters,
			...sorter,
		});
	};

	const onSearch = (value, _e) => {
		setSearchParams({
			...searchParams,
			pagination: {
				...searchParams.pagination,
				current: 1,
			},
			searchName: value,
		});
	};

	const onChange = (e) => {
		if (e.target.value !== searchName && loading === false) {
			setSearchParams({
				...searchParams,
				pagination: {
					...searchParams.pagination,
					current: 1,
				},
				searchName: e.target.value,
			});
			setSearchName(e.target.value);
		}
	};

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

    const columns = [
        {
            title: "Order Date",
            dataIndex: "orderDate",
            width: "15%",
            sorter: true,
            render: (text, record) => {
                // TODO: Overdue Tag
                //record.customerInterPo.creditTerm
                const originalDate = dayjs(text);
                const creditTerm = 30;
                const dueDate = originalDate.add(creditTerm, 'day');

                const currentDate = dayjs();
                
                //console.log(dueDate.toString() < currentDate.toString());
                
                return (
                    moment(text).format('DD/MM/YYYY')
                )
            }
        },
        {
            title: "Order Id",
            dataIndex: "orderId",
            width: "20%",
            key: "orderDBId",
            render: (orderId, record) => {
                const url = `/orderDetails?orderDBId=${record.orderDBId}`;
                return (
                    <NavLink to={url}>
                        {orderId}
                    </NavLink>
                );
            },
        },
        {
            title: "Company Name",
            dataIndex: "orderCompanyName",
            width: "20%",
            render: (customerName, record) => {
                if (record.customerInterPo === null || record.customerInterPo.customerId === null) {
                    return (<>{customerName}</>)
                }
                const url = `/customerDetails?customerId=${record.customerInterPo.customerId.toString()}`;
                return (
                    <NavLink to={url}>
                        {customerName}
                    </NavLink>
                );
            },
        },
        {
            title: "Customer Order No",
            dataIndex: "customerOrderNo",
            width: "20%",
        },
        {
            title: "Total(AUD)",
            dataIndex: "totalPrice",
            width: "10%",
            render: (_, record) => {
                const formattedTotal = _.toFixed(2);
                return ` ${formattedTotal}`;
            },
        },
        {
            title: "Status",
            dataIndex: "orderStatus",
            width: "15%",
            filters: [
                { text: "processing", value: "processing" },
                { text: "reversed", value: "reversed" },
                { text: "completed", value: "completed" },
            ],
            render: (status) => {
                const color = status === "processing" ? 'orange' :
                (status === "reversed" ? 'red' : 'green');
                
                return (
                    <span>
                        <Tag color={color}>
                            {status}
                        </Tag>
                    </span>
                );
            }
        },
    ];

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
                                <StatisticCard title="Order Summary" data={orderNo}  spanNumber={6}/>
                            </Col>
                            <Col span={12}>
                                <StatisticCard title="Order Summary"
                                    data={orderSummary}
                                    spanNumber={12}
                                />
                            </Col>
                        </Row>

                        <Card
                            headStyle={{ height: "5%" }}
                            bodyStyle={{ height: "85%", width: "100%" }}
                        >
                            <Row justify={"end"}>
                                <Col>
                                    <Input.Search
                                        placeholder="Search Order Id"
                                        onSearch={onSearch}
                                        enterButton
                                        style={{ width: 320, marginBottom: 20 }}
                                        onChange={onChange}
                                        value={searchName}
                                    />
                                </Col>
                            </Row>
                            <Table
                                rowKey={"orderDBId"}
                                columns={columns}
                                dataSource={dataSource}
                                pagination={searchParams.pagination}
                                loading={loading}
                                onChange={handlePageChange}
                            />
                        </Card>

                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default OrderPage;