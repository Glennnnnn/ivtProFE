import React, { useState, useEffect } from "react"
import "./index.scss"
import {
    Layout,
    Breadcrumb,
    Button,
    message,
    Card,
    Row,
    Col,
    Input,
    DatePicker,
    Select,
    Table,
    InputNumber,
    Form,
    Tag,
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, SaveOutlined
} from '@ant-design/icons'
import moment from "moment";
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { addRestock, searchProductList, } from "@/api/api.js";

const { Option } = Select;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    form,
    onDataChange,
    onSearchChange,
    onSelectChange,
    productList,
    ...restProps
}) => {
    const isNumberInput = inputType === 'number';

    const handleInputChange = (value) => {
        onDataChange(record.rowNo, dataIndex, value);
    };

    const handleSearchChange = (value) => {
        onSearchChange(value);
    }

    const handleSelectChange = (value) => {
        const selectedProduct = productList.find(product => product.ivtId.toString() === value);
        onSelectChange(record.rowNo, selectedProduct);
    }

    const inputNode =
        inputType === 'select' ? (
            <Select
                showSearch
                onSearch={handleSearchChange}
                onChange={handleSelectChange}
                placeholder="Search for product"
                optionLabelProp="label"
                defaultActiveFirstOption={false}
                filterOption={false}
                style={{ width: '100%' }}>
                {productList.map((product) => (
                    <Option key={product.ivtId.toString()}
                        value={product.ivtId.toString()}
                        label={product.ivtClassName.toString() + " " + product.tags.map((tag) => {
                            return (
                                tag.tagName + ':' + tag.tagValue
                            );
                        })}>
                        <div>{`${product.ivtClassName} - ${product.ivtSubclassCode}`}</div>
                        <span style={{ whiteSpace: 'pre-wrap' }}>
                            {product.tags.map((tag) => {
                                let color = tag.tagName.length > 5 ? 'geekblue' : 'green';
                                if (tag.tagName === 'color') {
                                    color = tag.tagValue;
                                }
                                return (
                                    <Tag color={color} key={tag.tagName}>
                                        {tag.tagName + ': ' + tag.tagValue}
                                    </Tag>
                                );
                            })}
                        </span>
                    </Option>
                ))}
            </Select>
        ) : isNumberInput ? (
            <InputNumber onChange={handleInputChange} placeholder="0" controls={false} />
        ) : (
            <Input onChange={(e) => handleInputChange(e.target.value)} />
        );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={`${dataIndex}_${record.key}`}
                    style={{ margin: 0, }}>
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const NewRestockPage = () => {
    const { Content } = Layout;
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [restockId, setRestockId] = useState('');
    const [restockDate, setRestockDate] = useState(dayjs());
    const [restockCompany, setRestockCompany] = useState('');
    const [restockNote, setRestockNote] = useState('');

    const [loading, setLoading] = useState(false);

    const [productList, setProductList] = useState([]);

    const [form] = Form.useForm();

    const [data, setData] = useState(
        [
            {
                rowNo: 1,
                ivtId: '',
                stockNote: '',
                stockOptAmount: 0,
                key: 1,
            }
        ]
    );

    const columns = [
        {
            title: '#',
            dataIndex: 'rowNo',
            width: '5%',
            key: 'rowNo'
        },
        {
            title: 'Product',
            dataIndex: 'ivtId',
            width: '50%',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'stockNote',
            width: '25%',
            editable: true,
        },
        {
            title: 'QTY',
            dataIndex: 'stockOptAmount',
            width: '10%',
            editable: true,
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) => {
                return (
                    <span>
                        <Button type="danger" icon={<PlusOutlined />} onClick={() => handleAddRow(record)} style={{ marginRight: 8 }} />
                        <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} />
                    </span>
                );
            },
        },
    ];

    const handleAddRow = (key) => {
        const newRow = {
            rowNo: data.length + 1,
            ivtId: '',
            stockNote: '',
            stockOptAmount: 0,
            key: new Date().getTime(),
        };

        setData((prevData) => {
            const updatedData = [
                ...prevData.slice(0, key.rowNo),
                newRow,
                ...prevData.slice(key.rowNo),
            ];
            const updatedDataWithRowNo = updatedData.map((row, index) => ({
                ...row,
                rowNo: index + 1,
            }));
            return updatedDataWithRowNo;
        });
    };

    const handleDeleteRow = (key) => {
        if (data.length !== 1) {
            const updatedData = data.filter((item) => item.rowNo !== key.rowNo);
            const updatedDataWithRowNo = updatedData.map((row, index) => ({
                ...row,
                rowNo: index + 1,
            }));
            setData(updatedDataWithRowNo);
        }
        else {
            form.resetFields();

            setData([{
                rowNo: 1,
                ivtId: '',
                stockNote: '',
                stockOptAmount: 0,
                key: 1,
            }])
        }
    };

    const handleInputChange = (rowNo, dataIndex, value) => {
        const newData = data.map((item) => {
            if (item.rowNo === rowNo) {
                return { ...item, [dataIndex]: value, };
            }
            return item;
        });

        setData(newData);
    };

    const handleSearchChange = async (value) => {
        try {
            const posts = await searchProductList(value);
            setProductList(posts.ivtResultPos);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            messageApi.open({
                type: "error",
                content: "Loading Product Error!",
            });
        }
    }

    const handleSelectChange = (rowNo, selectedProduct) => {
        const newData = data.map((item) => {
            if (item.rowNo === rowNo) {
                return {
                    ...item, ivtId: selectedProduct.ivtId,
                };
            }
            return item;
        });

        setData(newData);
    }

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'stockOptAmount' ? 'number' : col.dataIndex === 'ivtId' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: true,
                form,
                onDataChange: handleInputChange,
                onSearchChange: handleSearchChange,
                onSelectChange: handleSelectChange,
                productList: productList,
            }),
        };
    });

    const handleRestockIdChange = (e) => {
        setRestockId(e.target.value);
    };

    const handleRestockDateChange = (date) => {
        setRestockDate(date);
    };

    const handleRestockCompanyChange = (e) => {
        setRestockCompany(e.target.value);
    };

    const handleRestockNoteChange = (e) => {
        setRestockNote(e.target.value);
    }

    const onCancelClick = () => {
        navigate(-1);
    }

    const validateSave = () => {
        let isValid = true;
        let reason = "";

        if (restockId.trim() === '') {
            isValid = false;
            reason = "Restock Id cannot be empty!";
            return { isValid, reason };
        }

        if (restockDate === null) {
            isValid = false;
            reason = "Restock Date cannot be empty!";
            return { isValid, reason };
        }

        data.forEach(item => {
            if (item.product === '') {
                isValid = false;
                reason = "Product cannot be empty!";
                return { isValid, reason };
            }

            if (item.stockOptAmount === 0) {
                isValid = false;
                reason = "QTY cannot be 0!";
                return { isValid, reason };
            }
        })

        return { isValid, reason };
    }

    const onMenuClick = async () => {
        const { isValid, reason } = validateSave();
        if (isValid) {
            try {
                setLoading(true);
                const queryBody = {
                    "stockBatchId": restockId,
                    "stockBatchDate": moment(restockDate.toString()).format("YYYY/MM/DD"),
                    "stockBatchNote": restockNote,
                    "stockBatchCompany": restockCompany,
                    "stockPoList": data,
                };

                const posts = await addRestock(queryBody);
                if (posts.code === 200) {
                    messageApi.open({
                        type: "success",
                        content: "Save Order Success!",
                    });
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000)

                }
                else {
                    messageApi.open({
                        type: "error",
                        content: "Save Order Error!",
                    });
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
                messageApi.open({
                    type: "error",
                    content: "Save Restock Error!",
                });
            }
            finally {
                setLoading(false);
            }

        }
        else {
            messageApi.open({
                type: "error",
                content: reason,
            });
        }

    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const posts = await searchProductList("");
                setProductList(posts.ivtResultPos);
            }
            catch (error) {
                console.error('Error fetching data:', error);
                messageApi.open({
                    type: "error",
                    content: "Loading Product Error!",
                });
            }
        }

        fetchProductData();
    }, []);

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
                                title: "New Restock"
                            },
                        ]}
                        style={
                            { marginBottom: '20px' }
                        } />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
                        <Button icon={<DeleteOutlined />} size="large" onClick={onCancelClick} style={{ backgroundColor: "red", color: "white" }} className="edit-customer-details-button" > Cancel </Button>
                        <Button icon={<SaveOutlined />} size="large" onClick={onMenuClick} style={{ backgroundColor: "green", color: "white" }}
                            className="edit-customer-details-button" loading={loading} > Save </Button>
                    </div>


                    <div style={{ marginBottom: '20px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card bordered={false} style={{ height: 'auto', minHeight: '200px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}><span className="item-span">* Restock ID</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Restock ID"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={restockId}
                                                onChange={handleRestockIdChange}
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span">* Restock Date</span></Col>
                                        <Col span={18}>
                                            <DatePicker
                                                format='DD/MM/YYYY'
                                                value={restockDate}
                                                onChange={handleRestockDateChange}
                                                placeholder="Restock Date"
                                            />
                                        </Col>

                                        <Col span={6}><span className="item-span"> Restock Company</span></Col>
                                        <Col span={18}>
                                            <Input
                                                placeholder="Restock Company"
                                                style={{ border: 'none', borderBottom: '1px solid #d9d9d9' }}
                                                value={restockCompany}
                                                onChange={handleRestockCompanyChange}
                                            />
                                        </Col>

                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card bordered={false} style={{ height: 'auto', minHeight: '200px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}><span className="item-span">Restock Note</span></Col>
                                        <Col span={18}>
                                            <Input.TextArea
                                                placeholder="Restock Note"
                                                style={{ minHeight: "150px" }}
                                                value={restockNote}
                                                onChange={handleRestockNoteChange}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
                        <Form form={form} component={false}>
                            <Table
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                rowKey={"rowNo"}
                                bordered
                                dataSource={data}
                                columns={mergedColumns}
                                rowClassName="editable-row"
                                pagination={false} />
                        </Form>
                    </Card>
                </Content>
            </Layout >
        </div>
    );
};

export default NewRestockPage;