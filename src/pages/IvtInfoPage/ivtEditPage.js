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
  Select, Button, Divider, Tag, message, Switch
} from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import { createBrowserHistory } from 'history'
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
  const [messageApi, contextHolder] = message.useMessage();
  let location = useLocation()
  let navigate = useNavigate()
  const recordData = JSON.parse(location.state.ivtData)
  const baseData = Object.assign({}, recordData)
  const prePage = location.state.prePage

  //const { ivtCatId, ivtId, ivtClassId, tags } = recordData
  //const { ivtClassId, ivtCatName, ivtClassName, ivtNote, ivtPrice, ivtQty, ivtSubclassCode, ivtValue, tags } = modifiedData
  const { Content } = Layout;
  //console.log(recordData)

  // const [editableTags, setEditableTags] = useState(modifiedData.tags)
  // const [tagEditOpen, setTagEditOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false);
  const [existTagList, setExistTagList] = useState([])
  const [inputTagValue, setInputTagValue] = useState();




  // useEffect(() => {

  //   const queryTagByIvtClassAsync = async () => {
  //     let resJson = await http.post("/queryTag/queryTagResByIvtClass", { "ivtClassId": baseData.ivtClassId })
  //     let res = JSON.parse(JSON.stringify(resJson.data.data))
  //     // Object.keys(existTagList).map(tagName => {
  //     //   setInputTagValues({
  //     //     ...inputTagValues,
  //     //     tagName: ""
  //     //   })
  //     // })
  //     // console.log(res)
  //     // form.setFieldsValue({
  //     //   ivtClassName: baseData.ivtClassName,
  //     //   ivtSubclassCode: baseData.ivtSubclassCode,
  //     //   ivtCatName: baseData.ivtCatName,
  //     //   ivtQty: baseData.ivtQty,
  //     //   ivtValue: baseData.ivtValue,
  //     //   ivtPrice: baseData.ivtPrice,
  //     //   ivtNote: baseData.ivtNote,
  //     // });
  //     setExistTagList(res)
  //   }
  //   // console.log(baseData)
  //   queryTagByIvtClassAsync()

  // }, [baseData.ivtClassId])

  const breadcrumbRender = (item, params, items, paths) => {
    const isPrevious = items.indexOf(item) !== items.length - 2;
    return isPrevious ? <NavLink to={item.href}>{item.title}</NavLink> : <NavLink to='/ivtDetailPage' state={{ "prePage": "inventory", "ivtId": JSON.stringify(baseData.ivtId) }}>{item.title}</NavLink>;
  }

  const onTagValueInputChange = (event) => {
    console.log(event.target.id)
    setInputTagValue(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    console.log(inputTagValue)
    setInputTagValue("")
  };

  const navigateDetail = () => {
    let data = { "prePage": "inventory", "ivtId": JSON.stringify(baseData.ivtId) }
    let url = `/ivtDetailPage?ivtId=${baseData.ivtId}`;
    navigate(url, { state: data });
  }



  const onFinish = async (values) => {
    if (values["ivtQty"] !== baseData.ivtQty) {
      values.isQtyModified = true
      let modifiedQty = values["ivtQty"] - baseData.ivtQty
      values.modifiedQty = modifiedQty
      if (modifiedQty > 0) {
        values.modifiedQtyType = "restock"
      } else if (modifiedQty < 0) {
        values.modifiedQtyType = "reduce stock"
      }
    } else {
      values.isQtyModified = false
    }
    values.delFlag = values.delFlag === true ? 0 : 1;
    console.log('Received values of form: ', values);
    setSubmitLoading(true)
    let res = await http.post("/ivt/updateIvt", { values })
    if (res.data.code === 200) {
      messageApi.open({
        type: 'success',
        content: 'Success!',
      });
      setSubmitLoading(false)

    } else {
      messageApi.open({
        type: 'error',
        content: 'error!',
      });
      setSubmitLoading(false)
    }
    setTimeout(() => {
      navigateDetail()
    }, 1000)

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
      'delFlag': !baseData.delFlag,
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
          <div key={"outer" + tagName}>
            <div>{tagName}</div>
            <Form.Item lable={tagName} name={["tags", tagName]} key={tagName} style={{ width: '300px' }}>

              <Select
                disabled={true}
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
                        id={tagName}
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

          </div>
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

  return (
    <Layout>
      {contextHolder}
      <Content>
        <Breadcrumb
          itemRender={breadcrumbRender}
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
              title: prePage,
            },
            {
              title: 'Edit Inventory',
              href: '/'

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
            <Input disabled={true} />
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
          <Form.Item name="delFlag" label="Is Active">
            <Switch />
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
              <span>
                {baseData?.tags?.map((tag) => {
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
          {/* <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
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
          </Form.Item> */}

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit" loading={submitLoading} style={{ backgroundColor: "green", color: "white" }}>
                Submit
              </Button>
              <Button htmlType="cancel" onClick={navigateDetail} style={{ backgroundColor: "red", color: "white" }}>cancel</Button>
            </Space>
          </Form.Item>


        </Form>



      </Content>
    </Layout >

  )
};
export default IvtEditPage