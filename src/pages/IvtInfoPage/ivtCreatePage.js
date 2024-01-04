import { React, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import {
  Form,
  Input,
  InputNumber,
  Upload,
  Layout,
  Breadcrumb,
  Space,
  Select, Button, Divider
} from 'antd';
import { http } from "@/utils";
//const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const IvtCreatePage = () => {
  const [form] = Form.useForm();
  const { Content } = Layout;

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    //await http.post("/ivt/updateIvt", { values })
  };

  const clickTest = () => {
    console.log()
  }


  return (
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
              href: '/inventory'
            },
            {
              title: 'Create Inventory',

            },
          ]}
          style={
            { marginBottom: '20px' }
          }
        />
        <button onClick={clickTest}>test button</button>
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          form={form}
        >
          <Form.Item name="ivtId" label="ivtId" hidden='true'>
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="ivtClassName" label="Name">
            <Select
              showSearch
              allowClear
              style={{
                width: '280px',
              }}
              placeholder="Inventory Name"
            >
            </Select>
          </Form.Item>
          <Form.Item name="ivtSubclassCode" label="Code">
            <Input />
          </Form.Item>
          <Form.Item name="ivtCatName" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="ivtQty" label="Quantity">
            <InputNumber />
          </Form.Item>
          <Form.Item name="ivtValue" label="Value">
            <InputNumber />
          </Form.Item>
          <Form.Item name="ivtPrice" label="Price">
            <InputNumber />
          </Form.Item>

          <Form.Item name="ivtNote" label="Note">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload action="/upload.do" listType="picture-card">
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Content>
    </Layout >

  )
};

export default IvtCreatePage