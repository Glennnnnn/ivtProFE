import React, { useEffect, useState } from "react";

import {
    Button,
    Breadcrumb,
    Layout,
    Row,
    Col,
    message,
    Flex,
    Table,
    Card,
    Input,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, NavLink } from 'react-router-dom';
import { restockList } from "../../api/api.js";
import moment from "moment";


const RestockPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();

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
            const posts = await restockList(searchParams);
            if (posts.code === 200) {
                setDataSource(posts.data.StockBatchPo);
                setSearchParams({
                    ...searchParams,
                    pagination: {
                        ...searchParams.pagination,
                        total: posts.data.totalCount,
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

    const columns = [
        {
            title: "Restock Date",
            dataIndex: "stockBatchDate",
            width: "20%",
            sorter: true,
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
            title: "Restock Company",
            dataIndex: "stockBatchCompany",
            width: "20%",
        }
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
                                    title: "Restock",
                                    href: "",
                                },
                            ]}
                        />

                        <Flex align="flex-end" justify="flex-end">
                            <Link to="/newrestock">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                    className="new-customer-button">
                                    New Restock
                                </Button>
                            </Link>
                        </Flex>

                        <Card
                            headStyle={{ height: "5%" }}
                            bodyStyle={{ height: "85%", width: "100%" }}
                        >
                            <Row justify={"end"}>
                                <Col>
                                    <Input.Search
                                        placeholder="Search Restock Id"
                                        onSearch={onSearch}
                                        enterButton
                                        style={{ width: 320, marginBottom: 20 }}
                                        onChange={onChange}
                                        value={searchName}
                                    />
                                </Col>
                            </Row>
                            <Table
                                rowKey={"stockBatchDBId"}
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

export default RestockPage;