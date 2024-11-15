import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Flex } from "antd";
import { updateItemFile } from '../../api/api.js';

const { Dragger } = Upload;


const UpdateItemUpload = () => {
    const onChange = (info) => {
        if (info.file.status === "uploading") {
            return; 
        }

        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const beforeUpload = async (file) => {
        const isCSV = file.name.toLowerCase().endsWith(".csv");
        if (!isCSV) {
            message.error("You can only upload CSV file!");
            return false;
        }

        const isNewItemCSV = file.name.toLowerCase().includes("inventoryitem");
        if (!isNewItemCSV) {
            message.error("Inventory Items CSV Only!");
            return false;
        }

        try {
            const response = await updateItemFile(file);
            console.log(response);
            message.success(`${file.name} uploaded successfully!`);
        } catch (error) {
            message.error(`Upload failed: ${error.message}`);
        }

        return false;
    };

    return (
        <Flex vertical gap="large">

            <img src="/sample2.jpg" alt="sample" style={{ width: "100%", marginTop: '16px', marginBottom: '16px' }} />

            <Dragger
                name="file"
                beforeUpload={beforeUpload}
                accept=".csv"
                maxCount={1}
                onChange={onChange}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or Drag file to this area to upload
                </p>
                <p className="ant-upload-hint">Inventory Items CSV Only</p>
            </Dragger>
        </Flex>
    );
};

export default UpdateItemUpload;