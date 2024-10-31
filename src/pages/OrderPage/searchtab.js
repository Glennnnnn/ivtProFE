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
import { DeleteOutlined, CheckOutlined, DownloadOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom';
import { orderList, editOrderStatusByIds, deleteOrderByIds, queryOrderDataByIdList } from "../../api/api.js";
import moment from "moment";
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';


const SearchTab = () => {
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
            const posts = await orderList(searchParams);
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

    const handleExportCSV = async () => {
        try {
            setBulkLoading(true);
            const filteredList = [];
            for (const item of dataSource) {
                const checkId = selectedRowKeys.some(bigNumber => bigNumber.toString() === item.orderDBId.toString());
                if (checkId) {
                    if (item.isCashSale) {
                        messageApi.open({
                            type: "error",
                            content: "Cash Sale cannot be exported!",
                        });
                        return; // Stop the execution of the function
                    } else {
                        filteredList.push(item.orderDBId.toString());
                    }
                }
            }

            const posts = await queryOrderDataByIdList(filteredList);
            if (posts.code === 200) {
                const csvData = generateCSV(posts.data);
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
                saveAs(blob, 'data.csv');

                messageApi.open({
                    type: 'success',
                    content: 'Export CSV Success!',
                })

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: "error",
                content: "Export CSV Error!",
            });
        } finally {
            setBulkLoading(false);
        }
    }

    function generateCSV(data) {
        let csv = `*InvoiceNo,*Customer,*InvoiceDate,*DueDate,Terms,Location,Memo,*Item(Product/Service),ItemDescription, ItemQuantity,ItemRate,*ItemAmount,Item Tax Amount,*Item Tax Code,Currency\n`;
        data.forEach(item => {
            item.orderIvtPoList.forEach((eachItem, index) => {
                if (index === 0) {
                    csv += `${item.orderId.replace('PT', '')},${item.orderCompanyName.replace(',', ' ')},${moment(item.orderDate).format('DD/MM/YYYY')},${renderDueDate(item)},,,,${renderItem(eachItem).replace(',', ' ')},${eachItem.ivtClassName.replace(',', ' ')} ${renderTags(eachItem.tags)} ${renderItemDescription(eachItem)},${eachItem.orderIvtQty},${eachItem.orderIvtPrice},${eachItem.orderIvtTotal},${(parseFloat(eachItem.orderIvtTotal) * 0.1).toFixed(2)},GST,\n`;
                }
                else {
                    csv += `${item.orderId.replace('PT', '')},,,,,,,${renderItem(eachItem).replace(',', ' ')},${eachItem.ivtClassName.replace(',', ' ')} ${renderTags(eachItem.tags)} ${renderItemDescription(eachItem)},${eachItem.orderIvtQty},${eachItem.orderIvtPrice},${eachItem.orderIvtTotal},${(parseFloat(eachItem.orderIvtTotal) * 0.1).toFixed(2)},GST,\n`;
                }
            });
            if (item.orderShippingFee !== 0) {
                csv += `${item.orderId.replace('PT', '')},,,,,,,FC,Freight Charge,1,${item.orderShippingFee},${item.orderShippingFee},${(parseFloat(item.orderShippingFee) * 0.1).toFixed(2)},GST,\n`;
            }
        })
        return csv;
    }

    function renderItem(eachItem) {
        if (eachItem.ivtCatName === null || eachItem.ivtCatName === '' || eachItem.ivtCatName === undefined) {
            return eachItem.ivtSubClassCode ?? eachItem.ivtClassName;
        }
        else {
            return eachItem.ivtCatName + ":" + eachItem.ivtSubClassCode;
        }
    }

    function renderItemDescription(eachItem){
        if (eachItem.orderIvtDesc !== null && eachItem.orderIvtDesc !== "") {
            return "DESC: " + eachItem.orderIvtDesc.replace(',', ' ').replace('\n', ' ')
        }
        return ""
    }

    function renderDueDate(data) {
        const originalDate = moment(data.orderDate);

        if (data.customerInterPo === null || "immediately" === data.customerInterPo?.creditTerm || data.customerInterPo === undefined) {
            return originalDate.clone().format('DD/MM/YYYY');
        } else if (data.customerInterPo.creditTerm.includes("30")) {
            return originalDate.clone().add(1, 'month').endOf('month').format('DD/MM/YYYY');
        } else if (data.customerInterPo.creditTerm.includes("14")) {
            return originalDate.clone().add(14, 'day').format('DD/MM/YYYY');
        } else {
            return originalDate.clone().format('DD/MM/YYYY');
        }
    }

    function renderTags(tags) {
        if (!tags || tags.length === 0) {
            return "";
        }

        return tags.map(tag => {
            if (tag !== null) {
                return `${tag.tagName}: ${tag.tagValue.replace(',', ' ')}`;
            } else {
                return "";
            }
        }).join(" ");
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
            dataIndex: "orderSubTotal",
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
            <Row gutter={[16, 16]} justify={"center"} style={{ marginBottom: 20 }}>
                <Col span={24}>
                    <Input.Search
                        placeholder="Search Order Id"
                        onSearch={onSearch}
                        enterButton
                        size="large"
                        style={{ width: "100%", marginBottom: 0 }}
                        onChange={onChange}
                        value={searchName}
                    />
                </Col>

                <Col span={8}>
                    <Popconfirm title="Are you sure you want to complete selected order?"
                        onConfirm={handleComplete}
                        okText="Yes"
                        cancelText="No">
                        <Button type="primary" className="new-customer-button-search" icon={<CheckOutlined />} disabled={!hasSelected} loading={bulkLoading} size="large"
                            style={{ backgroundColor: hasSelected ? "green" : "", color: hasSelected ? "white" : "" }}>
                            Complete Selected
                        </Button>
                    </Popconfirm>
                </Col>
                <Col span={8}>
                    <Popconfirm title="Are you sure you want to delete selected order?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No">
                        <Button type="primary" className="new-customer-button-search" icon={<DeleteOutlined />} disabled={!hasSelected} loading={bulkLoading} size="large"
                            style={{ backgroundColor: hasSelected ? "red" : "", color: hasSelected ? "white" : "" }}>
                            Delete Selected
                        </Button>
                    </Popconfirm>
                </Col>
                <Col span={8}>
                    <Popconfirm title="Are you sure you want to export selected order?"
                        onConfirm={handleExportCSV}
                        okText="Yes"
                        cancelText="No">
                        <Button type="primary" className="new-customer-button-search" icon={<DownloadOutlined />} disabled={!hasSelected} loading={bulkLoading} size="large"
                            style={{ backgroundColor: hasSelected ? "deepskyblue" : "", color: hasSelected ? "white" : "" }}>
                            Export CSV
                        </Button>
                    </Popconfirm>
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
}

export default SearchTab;