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
import { NavLink, useLocation } from 'react-router-dom';
import { http } from "@/utils";
//const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const IvtEditPage = () => {
  const [form] = Form.useForm();
  let location = useLocation()
  const recordData = JSON.parse(location.state.ivtData)
  const baseData = Object.assign({}, recordData)
  const prePage = location.state.prePage

  //const { ivtCatId, ivtId, ivtClassId, tags } = recordData
  //const { ivtClassId, ivtCatName, ivtClassName, ivtNote, ivtPrice, ivtQty, ivtSubclassCode, ivtValue, tags } = modifiedData
  const { Content } = Layout;
  //console.log(recordData)

  // const [editableTags, setEditableTags] = useState(modifiedData.tags)
  // const [tagEditOpen, setTagEditOpen] = useState(false)
  const [existTagList, setExistTagList] = useState([])
  const [inputTagValue, setInputTagValue] = useState();




  useEffect(() => {

    const queryTagByIvtClassAsync = async () => {
      let resJson = await http.post("/queryTag/queryTagResByIvtClass", { "ivtClassId": baseData.ivtClassId })
      let res = JSON.parse(JSON.stringify(resJson.data.data))
      // Object.keys(existTagList).map(tagName => {
      //   setInputTagValues({
      //     ...inputTagValues,
      //     tagName: ""
      //   })
      // })
      // console.log(res)
      // form.setFieldsValue({
      //   ivtClassName: baseData.ivtClassName,
      //   ivtSubclassCode: baseData.ivtSubclassCode,
      //   ivtCatName: baseData.ivtCatName,
      //   ivtQty: baseData.ivtQty,
      //   ivtValue: baseData.ivtValue,
      //   ivtPrice: baseData.ivtPrice,
      //   ivtNote: baseData.ivtNote,
      // });
      setExistTagList(res)
    }
    // console.log(baseData)
    queryTagByIvtClassAsync()

  }, [baseData.ivtClassId])


  const onTagValueInputChange = (event) => {
    console.log(event.target.parentNode.parentNode.parentNode.parentNode)
    setInputTagValue(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    //setItems([...items, name || `New item ${index++}`]);
    console.log(e.target.value)
    setInputTagValue("")

    // });
    // setTimeout(() => {
    //   inputRef.current?.focus();
    // }, 0);
  };
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    await http.post("/ivt/updateIvt", { values })
  };

  const generateInitFormData = () => {
    let result = {
      'ivtId': baseData.ivtId,
      'ivtClassName': baseData.ivtClassName,
      'ivtSubclassCode': baseData.ivtSubclassCode,
      'ivtCatName': baseData.ivtCatName,
      'ivtQty': baseData.ivtQty,
      'ivtValue': baseData.ivtValue,
      'ivtPrice': baseData.ivtPrice,
      'ivtNote': baseData.ivtNote,
      'tags': (function () {
        let _tags = {}
        for (let i = 0; i < baseData.tags.length; i++) {
          _tags[baseData.tags[i].tagName] = baseData.tags[i].tagId
        }
        return _tags
      })()
    }
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
              // onChange={handleChange}
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

  // const tagForMap = (tag) => {
  //   // console.log(tag)
  //   const tagElem = (
  //     <Tag
  //       closable
  //       onClick={handleTagEditOpen}
  //       onClose={(e) => {
  //         e.preventDefault();
  //         handleTagClose(tag);
  //       }}
  //     >
  //       {tag.tagName + ':' + tag.tagValue}
  //     </Tag>
  //   );
  //   return (
  //     <span
  //       key={tag.tagId}
  //       style={{
  //         display: 'inline-block',
  //       }}
  //     >
  //       {tagElem}
  //     </span>
  //   );
  // };

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
              title: 'Inventory List'
            },
            // {
            //   title: (function () {
            //     return prePage.toLowerCase().replace(/\b([\w|']+)\b/g, function (word) {
            //       //return word.slice(0, 1).toUpperCase() + word.slice(1);  
            //       return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
            //     });
            //   })(),
            //   href: '/ivtDetailPage', recordData,
            // },
            {
              title: prePage,
              onClick: () => {

              }
            },
            {
              title: 'Edit Inventory',

            },
          ]}
          style={
            { marginBottom: '20px' }
          }
        />
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
          initialValues={generateInitFormData()}
        >
          <Form.Item name="ivtId" label="ivtId" hidden='true'>
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="ivtClassName" label="Name">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="ivtSubclassCode" label="Code">
            <Input />
          </Form.Item>
          <Form.Item name="ivtCatName" label="Category">
            <Input disabled={true} />
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
          {/* <Form.Item label="Select">
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item> */}
          <Form.Item label="tags">
            <Space size={[0, 8]} wrap>
              {/* {
                modifiedTags.map(tagForMap)
              } */}
              {renderTagForms()}
              {/* {
                selectExistTagOpen === false ? <></> : selectExistTag()
              }
              {
                addNewTagOpen === false ? <></> : addNewTagForm()
              }
              {
                addTagButtonOpen === false ? <></> : addTggButton()
              } */}
              {/* <Tag closeIcon={<CloseCircleOutlined />} onClose={log}>
              Tag 2
            </Tag> */}
            </Space>
          </Form.Item>
          {/* <Form.Item label="TreeSelect">
            <TreeSelect
              treeData={[
                {
                  title: 'Light',
                  value: 'light',
                  children: [
                    {
                      title: 'Bamboo',
                      value: 'bamboo',
                    },
                  ],
                },
              ]}
            />
          </Form.Item> */}
          {/* <Form.Item label="InputNumber">
            <InputNumber />
          </Form.Item>

          <Form.Item label="Switch" valuePropName="checked">
            <Switch />
          </Form.Item> */}
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
export default IvtEditPage