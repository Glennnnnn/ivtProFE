import React, { useEffect, useState } from "react";
import "./index.scss";

import {
    Button,
    Breadcrumb,
    Layout,
    Modal,
    Form,
    Input,
    message,
    Flex,
    Card,
    Table,
    Tag,
    Row,
    Col
} from "antd";
import { NavLink } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { addCompany, queryCompanyList } from "../../api/api.js";

const CompanyPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const [visible, setVisible] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const showModel = () => {
        setVisible(true);
    };

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchParams, setSearchParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 0,
        },
    });
    const [searchName, setSearchName] = useState("");

    const fetchDataAndUpdateState = async () => {
        try {
            setDataSource([]);
            setLoading(true);
            const posts = await queryCompanyList(searchParams);
            if (posts.code === 200) {
                setDataSource(posts.data.companyPoList);
                setSearchParams({
                    ...searchParams,
                    pagination: {
                        ...searchParams.pagination,
                        total: posts.data.count,
                    },
                });
                console.log(searchParams.pagination);
            } else {
                messageApi.open({
                    type: "error",
                    content: "Loading Customers Error!",
                });
            }
        } catch (error) {
            console.log(error);
            messageApi.open({
                type: "error",
                content: "Loading Customers Error!",
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
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
            width: "20%",
            // render: (companyDBId, record) => {
            //     const url = `/companyDetail?companyDBId=${record.companyId}`;
            //     return (
            //         <NavLink to={url}>
            //             {companyDBId}
            //         </NavLink>
            //     );
            // },
        },
        {
            title: "Company Email",
            dataIndex: "companyEmail",
            width: "20%",
        },
        {
            title: "Company Phone",
            dataIndex: "companyPhone",
            width: "20%",
        },
        {
            title: "Status",
            dataIndex: "delFlag",
            width: "20%",
            render: (status) => (
                <span>
                    <Tag color={status === false ? "green" : "volcano"}>
                        {status === false ? "active" : "inactive"}
                    </Tag>
                </span>
            ),
        }
    ];

    const handleOk = async () => {
        form.validateFields()
            .then(async (values) => {
                setAddLoading(true);
                try {
                    const posts = await addCompany(values);
                    if (posts.code === 200) {
                        setVisible(false);
                        form.resetFields();
                        window.location.reload();
                    } else {
                        messageApi.open({
                            type: "error",
                            content: "Add New Company Error!",
                        });
                    }
                } catch (error) {
                    console.log(error);
                    messageApi.open({
                        type: "error",
                        content: "Add New Company Error!",
                    });
                }
            })
            .catch((errorInfo) => {
                messageApi.open({
                    type: "error",
                    content: "Please fill in the required fields!",
                });
            })
            .finally(() => {
                setAddLoading(false);
            });
    };

    const handleCancel = () => {
        setVisible(false);
        setAddLoading(false);
        form.resetFields();
    };

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
                                    title: "Restock Company",
                                    href: "",
                                },
                            ]}
                        />

                        <Flex align="flex-end" justify="flex-end">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={showModel}
                                className="new-customer-button"
                            >
                                New Company
                            </Button>
                        </Flex>

                        <Modal
                            title="Add a New Company"
                            open={visible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            maskClosable={false}
                            width={600}
                            centered
                            footer={[
                                <Button
                                    key="back"
                                    onClick={handleCancel}
                                    style={{
                                        display: "inline-block",
                                        width: "calc(50% - 12px)",
                                        backgroundColor: "red",
                                        color: "white",
                                    }}
                                    size="large"
                                >
                                    Cancel
                                </Button>,
                                <Button
                                    key="submit"
                                    type="primary"
                                    loading={addLoading}
                                    onClick={handleOk}
                                    style={{
                                        display: "inline-block",
                                        width: "calc(50% - 12px)",
                                        margin: "0 12px",
                                        backgroundColor: "green",
                                        color: "white",
                                    }}
                                    size="large"
                                >
                                    Add
                                </Button>,
                            ]}
                        >
                            <span
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "normal",
                                }}
                            >
                                Company Information
                            </span>

                            <Form
                                form={form}
                                name="companyForm"
                                style={{
                                    maxWidth: 500,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    marginTop: "20px",
                                    marginBottom: "60px",
                                }}
                            >
                                <Form.Item
                                    name="companyName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter the company name",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="* Company Name"
                                        className="form-item"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="companyEmail"
                                >
                                    <Input
                                        placeholder="Email"
                                        className="form-item"
                                    />
                                </Form.Item>

                                <Form.Item name="companyPhone">
                                    <Input
                                        placeholder="Phone Number"
                                        className="form-item"
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>

                        <Card
                            headStyle={{ height: "5%" }}
                            bodyStyle={{ height: "85%", width: "100%" }}
                        >
                            <Row justify={"end"}>
                                <Col>
                                    <Input.Search
                                        placeholder="Search Company"
                                        onSearch={onSearch}
                                        enterButton
                                        style={{ width: 320, marginBottom: 20 }}
                                        onChange={onChange}
                                        value={searchName}
                                    />
                                </Col>
                            </Row>
                            <Table
                                rowKey={"companyId"}
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

export default CompanyPage;
