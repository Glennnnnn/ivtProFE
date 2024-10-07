import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Flex, Row, Col, Button } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import { uploadCompanyFile } from '../../api/api.js';

const { Dragger } = Upload;

const handleDownloadSample = () => {
    const csvData = `sequence,category,name,code,tags,quantity,price,note\n1\n`;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'newitem.csv');
}


const NewItemUpload = () => {
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
        const isCSV = file.type === "text/csv";
        if (!isCSV) {
            message.error("You can only upload CSV file!");
            return false;
        }

        const isNewItemCSV = file.name.toLowerCase().includes("newitem");
        if (!isNewItemCSV) {
            message.error("New Items CSV Only!");
            return false;
        }

        try {
            const response = await uploadCompanyFile(file);
            console.log(response);
            message.success(`${file.name} uploaded successfully!`);
        } catch (error) {
            message.error(`Upload failed: ${error.message}`);
        }

        return false;
    };

    return (
        <Flex vertical gap="large">

            <img src="/sample.png" alt="sample" style={{ width: "100%", marginTop: '16px', marginBottom: '16px' }} />

            <Row align="middle" gutter={16}> 
                <Col>
                    Please Download the sample CSV before uploading.
                </Col>
                <Col>
                    <Button
                        type="primary"
                        className="new-customer-button"
                        icon={<DownloadOutlined />}
                        style={{ backgroundColor: "deepskyblue", color: "white" }}
                        onClick={handleDownloadSample}
                    >
                        Sample CSV
                    </Button>
                </Col>
            </Row>

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
                <p className="ant-upload-hint">New Items CSV Only</p>
            </Dragger>
        </Flex>
    );
};

export default NewItemUpload;