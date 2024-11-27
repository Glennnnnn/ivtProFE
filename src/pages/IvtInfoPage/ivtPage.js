import React, { useEffect, useState } from "react"
import "./index.scss"

import { Card, Breadcrumb, Table, Tag, Input, Layout, Row, Col, Popconfirm, Button, message } from "antd";
import {
    FolderOutlined, DownloadOutlined
} from '@ant-design/icons'
//import img404 from '@/assets/error.png'
import { getInventoryDetailByIdsList } from "../../api/api.js";
import { http } from "@/utils";
import { NavLink } from "react-router-dom";
import { saveAs } from 'file-saver';


const IvtPage = () => {
    const { Content } = Layout;
    const [messageApi, contextHolder] = message.useMessage();

    //along with tag search, deprecated
    // const [searchTags, setSearchTags] = useState([])

    const [ivtResults, setIvtResults] = useState([])
    const [searchParas, setSearchParas] = useState({
        pageIndex: 1,
        pageSize: 100
    })
    const [ivtCount, setIvtCount] = useState()

    // search tags data, deprecated
    // useEffect(() => {
    //   const queryTags = async () => {
    //     const res = await http.get("/queryTag/querySearchInfo")
    //     setSearchTags(res.data.data)
    //   }
    //   queryTags()
    // }, [])


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const hasSelected = selectedRowKeys.length > 0;
    const [bulkLoading, setBulkLoading] = useState(false);

    const onSelectRowsChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectRowsChange,
    };

    useEffect(() => {

        const queryResults = async () => {
            const res = await http.post("/ivt/queryIvtResultByInfo", {
                searchParas
            })
            setIvtResults(res.data.ivtResultPos)
            setIvtCount(res.data.totalCount)
        }
        queryResults()

    }, [searchParas])

    const handleButtonClick = async (values) => {
        let searchInfo = values
        setSearchParas({
            ...searchParas,
            pageIndex: 1,
            searchInfo,
        })
    }

    const handlePageChange = (pageIndex, pageSize) => {
        setSearchParas({
            ...searchParas,
            pageIndex,
            pageSize
        })
    }

    const handleExport = async () => {
        try {
            setBulkLoading(true);

            var queryBody = {
                "ivtIdList": selectedRowKeys.map(i => i.toString())
            };
            const posts = await getInventoryDetailByIdsList(queryBody);

            if (posts.code === 200) {
                const csvData = generateCSV(posts.data);
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
                saveAs(blob, 'inventoryItem.csv');

                messageApi.open({
                    type: 'success',
                    content: 'Export Inventory Items Success!',
                })
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: "error",
                content: "Export Inventory Items Error!",
            });
        } finally {
            setBulkLoading(false);
        }
    }

    const handleExportQuantity = async () => {
        try {
            setBulkLoading(true);

            var queryBody = {
                "ivtIdList": selectedRowKeys.map(i => i.toString())
            };
            const posts = await getInventoryDetailByIdsList(queryBody);

            if (posts.code === 200) {
                const csvData = generateQuantityCSV(posts.data);
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
                saveAs(blob, 'inventoryQuantity.csv');

                messageApi.open({
                    type: 'success',
                    content: 'Export Inventory Quantity Success!',
                })
            }
        }
        catch (error) {
            console.log(error);
            messageApi.open({
                type: "error",
                content: "Export Inventory Quantity Error!",
            });
        } finally {
            setBulkLoading(false);
        }
    }

    function generateCSV(data) {
        let csv = `Id,Name,Code,Quantity,Price,Note,Alert Amount\n`;
        data.forEach(item => {
            csv += `ID${item.ivtId},${item.ivtClassName.replace(/,/g, ';')},Code:${item.ivtSubclassCode},${item.ivtQty},${item.ivtPrice},${item.ivtNote === null ? "" : item.ivtNote.replace(/,/g, ' ').replace(/\n/g, ' ')},${item.lowStockAlertAmount}\n`;
        });
        return csv;
    }

    function generateQuantityCSV(data) {
        let csv = `Id,Name,Quantity\n`;
        data.forEach(item => {
            csv += `ID${item.ivtId},${item.ivtClassName.replace(/,/g, ';')},${item.ivtQty}\n`;
        });
        return csv;
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'ivtClassName',
            width: 220,
            key: 'ivtClassName',
            render: (ivtClassName, record) => {
                // console.log(JSON.stringify(ivtClassName) + JSON.stringify(record))
                const url = `/ivtDetailPage?ivtId=${record.ivtId}`;
                return (
                    <>
                        <NavLink to={url} state={{ "prePage": "inventory", "ivtId": JSON.stringify(record.ivtId) }} >
                            {ivtClassName + " "}
                        </NavLink>
                        {record.delFlag === 1 && <Tag color={'black'} > Unavailable </Tag>}
                        {record.ivtQty <= record.lowStockAlertAmount && <Tag color={'red'} key={record.ivtId}> Low Stock </Tag>}
                    </>
                )
            }
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            render: (tags) => (
                <span>
                    {tags.map((tag) => {
                        let color = tag.tagName.length > 5 ? 'geekblue' : 'green';
                        if (tag.tagName === 'color') {
                            color = tag.tagValue;
                        }
                        return (
                            <Tag color={color} key={tag.tagName}>
                                {tag.tagName + ':' + tag.tagValue}
                                {/* {tag.toUpperCase()} */}
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
        {
            title: 'Code',
            dataIndex: 'ivtSubclassCode',
        },
        {
            title: 'Note',
            dataIndex: 'ivtNote',
        },
        {
            title: 'Quantity',
            dataIndex: 'ivtQty',

        },
        {
            title: 'Price',
            dataIndex: 'ivtPrice',
            render: (_, record) => {
                const formattedTotal = _.toFixed(2);
                return ` ${formattedTotal}`;
            },
        },
    ]

    return (
        <div className="ivt-layout">
            {contextHolder}
            <Layout>
                <Content>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: 'Home',
                                href: '/'
                            },
                            {
                                title: 'Inventory List',
                                href: '',
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        }
                    />

                    {/* <Flex align="flex-end" justify="flex-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              href="/ivtCreatePage"
              className="new-customer-button"
            >
              New Inventory
            </Button>
          </Flex> */}


                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 64]}>
                            <Col span={12}>
                                <Card
                                    title={
                                        <div><FolderOutlined /> Inventory details</div>
                                    }
                                    bordered={false}
                                    style={{ height: '200px' }}>
                                    {<div style={{ paddingLeft: '10px', position: 'absolute', top: '60%', left: '3%' }}>
                                        <span style={{ fontSize: '20px' }}>All products</span><br />
                                        <span style={{ fontSize: '30px' }}>{ivtCount}</span>
                                    </div>}
                                    {<div style={{ paddingRight: '10px', position: 'absolute', top: '60%', right: '10%' }}>
                                        <span style={{ fontSize: '20px' }}>Active</span><br />
                                        <span style={{ fontSize: '30px' }}>{ivtCount}</span>
                                    </div>}
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    title={
                                        <div><FolderOutlined /> Inventory details</div>
                                    }
                                    bordered={false}
                                    style={{ height: '200px' }}>
                                    {<div style={{ paddingLeft: '10px', position: 'absolute', top: '60%', left: '3%' }}>
                                        <span style={{ fontSize: '20px' }}>All products</span><br />
                                        <span style={{ fontSize: '30px' }}>{ivtCount}</span>
                                    </div>}
                                    {<div style={{ paddingRight: '10px', position: 'absolute', top: '60%', right: '10%' }}>
                                        <span style={{ fontSize: '20px' }}>Active</span><br />
                                        <span style={{ fontSize: '30px' }}>{ivtCount}</span>
                                    </div>}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <Card
                        headStyle={{ height: '5%' }}
                        bodyStyle={{ height: '85%', width: '100%' }}

                    >
                        <Row>
                            <Col span={16}>
                                <Popconfirm title="Are you sure you want to export selected inventory?"
                                    onConfirm={handleExport}
                                    okText="Yes"
                                    cancelText="No">
                                    <Button type="primary" className="new-customer-button" icon={<DownloadOutlined />} disabled={!hasSelected} loading={bulkLoading}
                                        style={{ backgroundColor: hasSelected ? "deepskyblue" : "", color: hasSelected ? "white" : "" }}>
                                        Export Inventory
                                    </Button>
                                </Popconfirm>
                                <Popconfirm title="Are you sure you want to export selected inventory?"
                                    onConfirm={handleExportQuantity}
                                    okText="Yes"
                                    cancelText="No">
                                    <Button type="primary" className="new-customer-button" icon={<DownloadOutlined />} disabled={!hasSelected} loading={bulkLoading}
                                        style={{ backgroundColor: hasSelected ? "green" : "", color: hasSelected ? "white" : "" }}>
                                        Quantity Only
                                    </Button>
                                </Popconfirm>
                            </Col>
                            <Col>
                                <Input.Search
                                    placeholder="Search Inventory"
                                    onSearch={handleButtonClick}
                                    enterButton
                                    style={{ width: 320, marginBottom: 20 }}
                                />
                            </Col>
                        </Row>
                        <Table
                            rowSelection={rowSelection}
                            rowKey={"ivtId"}
                            columns={columns}
                            dataSource={ivtResults}
                            pagination={{
                                position: ['bottomCenter'],
                                current: searchParas.pageIndex,
                                pageSize: searchParas.pageSize,
                                total: ivtCount,
                                onChange: handlePageChange
                            }}
                        />
                    </Card>
                </Content>
            </Layout>
        </div >
    )
}

export default IvtPage