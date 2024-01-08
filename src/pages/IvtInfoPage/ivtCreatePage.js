import { React, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  EditableProTable,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';

import {

  Select, Layout, Row, Col, Card
} from 'antd';
// import { http } from "@/utils";
// import TextArea from 'antd/es/input/TextArea';
//const { RangePicker } = DatePicker;
const waitTime = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// const options = [];


const columns = [
  {
    title: 'tags',
    dataIndex: 'tags',
    width: '15%',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: 'Quantity',
    key: 'ivtQty',
    dataIndex: 'ivtQty',
    valueType: 'digit',
  },
  {
    title: 'Value',
    key: 'ivtValue',
    dataIndex: 'ivtValue',
    valueType: () => ({ type: 'money', locale: "en-US" })
  },
  {
    title: 'Price',
    key: 'ivtPrice',
    dataIndex: 'ivtPrice',
    valueType: () => ({ type: 'money', locale: "en-US" })
  },
  {
    title: 'note',
    dataIndex: 'ivtNote',
    width: '30%',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 250,
    render: () => {
      return null;
    },
  },
];

const defaultData = [
  {
    id: 624748504,
    ivtQty: '10',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: 1590486176000,
  },
  {
    id: 624691229,
    ivtQty: '10',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: 1590481162000,
  },
];

const IvtCreatePage = () => {
  const { Content } = Layout;
  const [dataSource, setDataSource] = useState(() => defaultData);
  const [editableKeys, setEditableRowKeys] = useState(
    defaultData.map((item) => item.id),
  );
  const [basicTagOpts, setBasicTAgOpts] = useState([
    { a: [1, 2, 3] },
    { b: [1, 2, 3] },
    { c: [1, 2, 3] },
  ])

  const renderTagOpts = () => {
    console.log(basicTagOpts[1].b)
    basicTagOpts.forEach(tagGroup => {
      for (let tagKey in tagGroup) {
        console.log(tagKey + ':', tagGroup[tagKey]);
      }
    });
  }
  const handleChange = (value, option) => {
    console.log("selected" + JSON.stringify(option));
    console.log(value)
  };
  return (
    <div className="ivt-layout">
      <Layout>
        <Content style={{ margin: '10px' }}>
          <ProForm
            grid
            onFinish={async (values) => {
              await waitTime(2000);
              console.log(values);
            }}
          >
            <div style={{ marginBottom: '20px', width: '100%' }}>
              <Row gutter={[16, 16]}>

                <Col span={8}>
                  <ProForm.Group>
                    <Card bordered={false} style={{ height: 'auto', minHeight: '220px', width: '100%' }}>
                      <Row gutter={[16, 16]}>

                        <Col span={24}>
                          <ProFormText
                            width="md"
                            name="ivtClassName"
                            label="Inventory Name"
                            tooltip="maximum length is 24"
                            placeholder="Inventory Name"
                          />
                        </Col>

                        <Col span={24}>
                          <ProFormText
                            width="md"
                            name="ivtSubclassCode"
                            label="Code"
                            placeholder="Code"
                          />
                        </Col>
                      </Row>

                    </Card>
                  </ProForm.Group>
                </Col>
                <Col span={16}>
                  <Card bordered={false} style={{ height: 'auto', minHeight: '220px' }}>
                    <Row gutter={[16, 16]}>
                      <Col span={6}><span className="item-span">Customer Order No</span></Col>
                      <Col span={18}>
                        <Select
                          mode="tags"
                          style={{
                            width: '100%',
                          }}
                          placeholder="Tags Mode"
                          open={false}
                          option={{ id: "10" }}
                          //labelInValue={true}
                          suffixIcon={<PlusOutlined />}
                          defaultValue={basicTagOpts[1].b}
                          onChange={handleChange}
                        //onChange={handleChange}
                        />
                      </Col>
                      <Col span={6}><span className="item-span">Customer Order No1</span></Col>
                      <Col span={18}>

                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

            </div>

            <ProForm.Item
              label="Inventory Items"
              name="dataSource"
              // initialValue={defaultData}
              trigger="onValuesChange"
            >
              <EditableProTable
                rowKey="id"
                toolBarRender={false}
                columns={columns}
                defaultValue={dataSource}
                recordCreatorProps={{
                  newRecordType: 'dataSource',
                  position: 'bottom',
                  record: () => ({
                    id: Date.now(),
                    addonBefore: 'ccccccc',
                    decs: 'testdesc',
                  }),
                }}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  actionRender: (row, config, defaultDoms) => {
                    return [defaultDoms.delete];
                  },
                }}
              />
            </ProForm.Item>
          </ProForm >
          <button onClick={renderTagOpts}>cccc</button>
        </Content>
      </Layout >
    </div>

  );

};

export default IvtCreatePage