import React from "react";
import { Tabs } from "antd";
import { PlusSquareOutlined, EditOutlined } from '@ant-design/icons';
import NewItemUpload from "./newItem";
import UpdateItemUpload from "./updateItem";
import UpdateQuantityUpload from "./updateQuantity";

const UploadPage = () => {
    const items = [
        {
            key: "1",
            label: "New Items",
            children: <NewItemUpload />,
            icon: <PlusSquareOutlined />,
            destroyInactiveTabPane: true,
        },
        {
            key: "2",
            label: "Update Items",
            children: <UpdateItemUpload />,
            icon: <EditOutlined />,
            destroyInactiveTabPane: true,
        },
        {
            key: "3",
            label: "Update Quantity",
            // disabled: true,
            children: <UpdateQuantityUpload />,
            icon: <EditOutlined />,
            destroyInactiveTabPane: true,
        }
    ];

    return <Tabs
        type="card"
        size="large"
        centered
        defaultActiveKey="1"
        items={items}
    />;
};

export default UploadPage;