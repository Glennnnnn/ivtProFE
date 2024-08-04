import React, { useEffect, useState } from "react";
import "./index.scss"
import {
    Button,
    Row,
    Col,
    message,
    Tag,
    Table,
    Card,
    Input,
    Popconfirm,
} from 'antd'
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom';
import { orderListWithPx, editOrderStatusByIds, deleteOrderByIds } from "../../api/api.js";
import moment from "moment";
import dayjs from 'dayjs';


const CashSaleTab = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [loading, setLoading] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchParams, setSearchParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 0,
        },
    });
    const [searchName, setSearchName] = useState("");
    const hasSelected = selectedRowKeys.length > 0;

    const onSelectRowsChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectRowsChange,
    };

    const fetchDataAndUpdateState = async () => {
        try {
            setDataSource([]);
            setLoading(true);
            const posts = await orderListWithPx(searchParams, 2);
            if (posts.code === 200) {
                if (posts.data.count === 1) {
                    const orderDBId = posts.data.responsePoList[0].orderDBId.toString();
                    window.location.href = `/orderDetails?orderDBId=${orderDBId}`;
                }
                else {
                    setDataSource(posts.data.responsePoList);
                    setSearchParams({
                        ...searchParams,
                        searchName: searchName,
                        pagination: {
                            ...searchParams.pagination,
                            total: posts.data.count,
                        },
                    });
                }
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

    const handleComplete = async () => {
        try {
            setBulkLoading(true);
            const filteredList = [];
            for (const item of dataSource) {
                const checkId = selectedRowKeys.some(bigNumber => bigNumber.toString() === item.orderDBId.toString());

                if (checkId) {
                    if (item.orderStatus !== "processing") {
                        messageApi.open({
                            type: "error",
                            content: "Selected order status should be processing!",
                        });
                        return; // Stop the execution of the function
                    } else {
                        filteredList.push(item.orderDBId.toString());
                    }
                }
            }

            const posts = await editOrderStatusByIds(filteredList, 'completed');
            if (posts.code === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Complete Selected Orders Success!',
                })
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
            else {
                messageApi.open({
                    type: "error",
                    content: "Complete Selected Orders Error!",
                });
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: "error",
                content: "Complete Selected Orders Error!",
            });
        } finally {
            setBulkLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            setBulkLoading(true);
            const filteredList = [];
            for (const item of dataSource) {
                const checkId = selectedRowKeys.some(bigNumber => bigNumber.toString() === item.orderDBId.toString());

                if (checkId) {
                    if (item.orderStatus !== "processing") {
                        messageApi.open({
                            type: "error",
                            content: "Selected order status should be processing!",
                        });
                        return; // Stop the execution of the function
                    } else {
                        filteredList.push(item.orderDBId.toString());
                    }
                }
            }

            const posts = await deleteOrderByIds(filteredList);
            if (posts.code === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Delete Selected Orders Success!',
                })
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
            else {
                messageApi.open({
                    type: "error",
                    content: "Delete Selected Orders Error!",
                });
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: "error",
                content: "Delete Selected Orders Error!",
            });
        } finally {
            setBulkLoading(false);
        }
    }

    useEffect(() => {
        fetchDataAndUpdateState();
    }, [JSON.stringify(searchParams)]);

    const handlePageChange = (pagination, filters, sorter) => {
        if (pagination.pageSize !== searchParams.pagination?.pageSize) {
            console.log("page size changed");
            pagination.current = 1;
            setDataSource([]);
        }

        setSelectedRowKeys([]);
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
            // setSearchParams({
            //     ...searchParams,
            //     pagination: {
            //         ...searchParams.pagination,
            //         current: 1,
            //     },
            //     searchName: e.target.value,
            // });
            setSearchName(e.target.value);
        }
    };

    const columns = [
        {
            title: "Order Date",
            dataIndex: "orderDate",
            width: "20%",
            sorter: true,
            render: (text, record) => {
                let isCashSale = record.isCashSale;
                if (record.orderStatus !== "processing") {
                    if (isCashSale === true) {
                        return (
                            <>
                                <span>{moment(text).format('DD/MM/YYYY')}  </span>
                                <Tag color={"green"}> cash sale </Tag>
                            </>
                        )
                    }
                    return (
                        <>
                            <span>{moment(text).format('DD/MM/YYYY')}  </span>
                        </>
                    )
                }
                const originalDate = dayjs(text);
                const currentDate = dayjs();

                let isOverDue = true;

                if (record.customerInterPo === null || "immediately" === record.customerInterPo?.creditTerm) {
                    isOverDue = currentDate.isAfter(originalDate)
                }
                else if (record.customerInterPo.creditTerm.includes("30")) {
                    isOverDue = currentDate.isAfter(originalDate.add(1, 'month').endOf('month'));
                }
                else if (record.customerInterPo.creditTerm.includes("14")) {
                    isOverDue = currentDate.isAfter(originalDate.add(14, 'day'));
                }

                if (isOverDue) {
                    if (isCashSale === true) {
                        return (
                            <>
                                <span>{moment(text).format('DD/MM/YYYY')}  </span>
                                <Tag color={"green"}> cash sale </Tag>
                                <Tag color={"red"}> overdue </Tag>
                            </>
                        )
                    } else {
                        return (
                            <>
                                <span>{moment(text).format('DD/MM/YYYY')}  </span>
                                <Tag color={"red"}> overdue </Tag>
                            </>
                        )
                    }
                }
                else {
                    if (isCashSale === true) {
                        return (
                            <>
                                <span>{moment(text).format('DD/MM/YYYY')}  </span>
                                <Tag color={"green"}> cash sale </Tag>
                            </>
                        )
                    } else {
                        return (
                            <>
                                <span>{moment(text).format('DD/MM/YYYY')}  </span>
                            </>
                        )
                    }

                }
            }
        },
        {
            title: "Order Id",
            dataIndex: "orderId",
            width: "20%",
            sorter: true,
            key: "orderDBId",
            render: (orderId, record) => {
                const url = `/orderDetails?orderDBId=${record.orderDBId}`;
                return (
                    <>
                        {!record.isCashSale && (
                            <>
                                {(record.isReportGenerated === null || record.isReportGenerated === false) && (
                                    <Tag color="orange">Ready for export</Tag>
                                )}
                                {record.isReportGenerated === true && (
                                    <Tag color="green">Exported</Tag>
                                )}
                            </>
                        )}
                        <NavLink to={url}>
                            {orderId}
                        </NavLink>
                    </>
                );
            },
        },
        {
            title: "Company Name",
            dataIndex: "orderCompanyName",
            sorter: true,
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
            width: "15%",
        },
        {
            title: "Total(AUD)",
            dataIndex: "totalPrice",
            width: "10%",
            render: (_, record) => {
                const total = parseFloat(record.orderSubTotal) * (1 - (record.orderDiscount ?? 0) / 100) + parseFloat(record.orderShippingFee) + parseFloat(record.orderPreBalance);
                const formattedTotal = total.toFixed(2);
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
        <Card style={{ marginTop: "0px", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
            {contextHolder}
            <Row justify={"end"}>
                <Col span={12}>
                    <Popconfirm title="Are you sure you want to complete selected order?"
                        onConfirm={handleComplete}
                        okText="Yes"
                        cancelText="No">
                        <Button type="primary" className="new-customer-button" icon={<CheckOutlined />} disabled={!hasSelected} loading={bulkLoading}
                            style={{ backgroundColor: hasSelected ? "green" : "", color: hasSelected ? "white" : "" }}>
                            Complete Selected
                        </Button>
                    </Popconfirm>
                    <Popconfirm title="Are you sure you want to delete selected order?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No">
                        <Button type="primary" className="new-customer-button" icon={<DeleteOutlined />} disabled={!hasSelected} loading={bulkLoading}
                            style={{ backgroundColor: hasSelected ? "red" : "", color: hasSelected ? "white" : "" }}>
                            Delete Selected
                        </Button>
                    </Popconfirm>
                </Col>
                <Col span={7}>

                </Col>
                <Col span={5}>
                    <Input.Search
                        placeholder="Search Order Id"
                        onSearch={onSearch}
                        enterButton
                        style={{ width: "100%", marginBottom: 20 }}
                        onChange={onChange}
                        value={searchName}
                    />
                </Col>
            </Row>
            <Table
                rowSelection={rowSelection}
                rowKey={"orderDBId"}
                columns={columns}
                dataSource={dataSource}
                pagination={searchParams.pagination}
                loading={loading}
                onChange={handlePageChange}
            />
        </Card>
    )
};

export default CashSaleTab;