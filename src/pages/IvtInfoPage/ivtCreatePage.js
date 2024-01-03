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

  const [existTagList, setExistTagList] = useState([])
  const [inputTagValue, setInputTagValue] = useState();
  const [openTagOpts, setOpenTagOpts] = useState(false)
  const [ivtClassOpts, setIvtClassOpts] = useState();

  const [inputIvtClassValue, setInputIvtClassValuee] = useState();

  useEffect(() => {
    const queryBaseData = async () => {
      let resJson = await http.get("/ivtClass/queryIvtClassList")
      let res = JSON.parse(JSON.stringify(resJson.data.data))
      let ivtClassOptions = []
      for (var i = 0; i < res.length; i++) {
        ivtClassOptions.push({
          label: res[i]["ivtClassName"],
          value: res[i]["ivtClassId"]
        })

      }
      setIvtClassOpts(ivtClassOptions);
    }

    queryBaseData()
  }, [])

  const onTagValueInputChange = (event) => {

    setInputTagValue(event.target.value);
  };
  //ivt class info change related functions
  const ivtClassfilterOption = (input, option) => {
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  }

  const onIvtClassChange = (value) => {
    console.log(`selected ${value}`);
  };

  const addItem = (e) => {
    e.preventDefault();
    //setItems([...items, name || `New item ${index++}`]);
    console.log(e.target.value)
    setInputTagValue("")
  };
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    await http.post("/ivt/updateIvt", { values })
  };

  const generateInitFormData = () => {
    let result = {
      'ivtClassName': ivtClassOpts
    }
    console.log(result)
    return result
  }

  const renderTagForms = () => {
    return (
      Object.keys(existTagList).map(tagName => {
        //console.log(existTagList[tagName])
        return (

          <Form.Item lable={tagName} name={["tags", tagName]} key={tagName} style={{ width: '300px' }}>
            <Select
              allowClear
              style={{
                width: '280px',
              }}
              placeholder={tagName}
              options={processTagOptions(existTagList[tagName])}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: '8px 0',
                    }}
                  />
                  <Space
                    style={{
                      padding: '0 8px 4px',
                    }}
                  >
                    <Input
                      placeholder="Please enter item"
                      style={{ width: '150px' }}
                      value={inputTagValue}
                      onChange={onTagValueInputChange}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addItem} style={{ width: '20px' }}>
                      Add tag
                    </Button>
                  </Space>
                </>
              )}
            >
            </Select>
          </Form.Item>
        )
      })
    )
  }

  const processTagOptions = (tagValues) => {
    let tagValueOptions = []
    //console.log(tagValues)
    for (var i = 0; i < tagValues.length; i++) {
      for (let obj in tagValues[i]) {
        tagValueOptions.push({
          label: tagValues[i][obj],
          value: obj
        })
      }
    }
    //console.log(tagValueOptions)
    return tagValueOptions
  }

  const clickTest = () => {
    console.log(ivtClassOpts)
  }

  const onIvtClassValueInputChange = (event) => {
    setInputIvtClassValuee(event.target.value);
  };

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
              // onChange={handleChange}
              options={ivtClassOpts}
              filterOption={ivtClassfilterOption}
              onChange={onIvtClassChange}
            // onSearch={onSearch}
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
          {openTagOpts && <Form.Item label="tags">
            <Space size={[0, 8]} wrap>
              renderTagForms()
            </Space>
          </Form.Item>}
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