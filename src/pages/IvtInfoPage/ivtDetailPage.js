import { React, useState, useEffect } from 'react';
import { PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';

import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Switch,
  TreeSelect,
  Upload,
  Layout,
  Breadcrumb,
  Tag,
  Space,
  Select, Button
} from 'antd';
import { useLocation } from 'react-router-dom';
import { http } from "@/utils";
//const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const IvtDetailPage = () => {
  const [form] = Form.useForm();
  let location = useLocation()
  const recordData = JSON.parse(location.state)
  const baseData = Object.assign({}, recordData)
  const [modifiedTags, setModifiedTags] = useState(baseData.tags)

  //const { ivtCatId, ivtId, ivtClassId, tags } = recordData
  //const { ivtClassId, ivtCatName, ivtClassName, ivtNote, ivtPrice, ivtQty, ivtSubclassCode, ivtValue, tags } = modifiedData
  const { Content } = Layout;
  const [componentDisabled, setComponentDisabled] = useState(true);
  //console.log(recordData)

  // const [editableTags, setEditableTags] = useState(modifiedData.tags)
  // const [tagEditOpen, setTagEditOpen] = useState(false)
  const [existTagList, setExistTagList] = useState([])
  const [addNewTagOpen, setAddNewTagOpen] = useState(false)
  const [addTagButtonOpen, setAddTagButtonOpen] = useState(true)
  const [selectExistTagOpen, setSelectExistTagOpen] = useState(false)
  let addNewTagName = ""
  let addNewTagValue = ""
  let addExistTagList = []



  useEffect(() => {

    const queryTagByIvtClassAsync = async () => {
      let resJson = await http.post("/queryTag/queryTagByIvtClass", { "ivtClassId": baseData.ivtClassId, "ivtId": baseData.ivtId })
      let res = JSON.parse(JSON.stringify(resJson.data))
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
    queryTagByIvtClassAsync()

  }, [baseData.ivtClassId, baseData.ivtId, form])

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const resetAddNewTagForm = () => {
    form.setFieldsValue({
      newTagName: '',
      newTagValue: '',
    });
  }
  const handleAddExistTag = (value) => {
    addExistTagList = value
    // console.log(addExistTagList)
  }

  const handleAddExistTagCancel = () => {
    addExistTagList = []
    // console.log(addExistTagList)
  }

  const handleAddExistTagConfirm = () => {
    // console.log(addExistTagList)
    for (let i = 0; i < addExistTagList.length; i++) {
      for (let j = 0; j < existTagList.length; j++) {
        //console.log(existTagList[j])
        if (existTagList[j].tagId === addExistTagList[i]) {

          //push these new exist tags into the base list
          //put these codes inside the loop is because the addExitTagList does not have the whole tag info 
          let _modifiedTags = modifiedTags.concat()
          _modifiedTags.push(existTagList[j])
          setModifiedTags(_modifiedTags)

          //remove from exist tag list
          let _existTagList = existTagList.concat()
          _existTagList.splice(j, 1)
          setExistTagList(_existTagList)
          // console.log(modifiedData)
        }
      }


    }
  }

  const handleTagEditOpen = () => {
    console.log("print")
    //editTagList.push("a")
  }


  const handleTagClose = (removedTag) => {
    let newTags = modifiedTags.filter((tag) => tag !== removedTag);
    //console.log(newTags);
    let _modifiedTags = modifiedTags.concat()
    _modifiedTags = newTags
    setModifiedTags(
      _modifiedTags
    )
    let _existTagList = existTagList.concat()
    _existTagList.push(removedTag)
    setExistTagList(_existTagList)
  };

  const tagForMap = (tag) => {
    // console.log(tag)
    const tagElem = (
      <Tag
        closable
        onClick={handleTagEditOpen}
        onClose={(e) => {
          e.preventDefault();
          handleTagClose(tag);
        }}
      >
        {tag.tagName + ':' + tag.tagValue}
      </Tag>
    );
    return (
      <span
        key={tag.tagId}
        style={{
          display: 'inline-block',
        }}
      >
        {tagElem}
      </span>
    );
  };

  const processTagOptions = () => {
    let tagOptions = []
    for (var i = 0; i < existTagList.length; i++) {
      tagOptions.push({
        label: existTagList[i].tagName + ":" + existTagList[i].tagValue,
        value: existTagList[i].tagId,
      })
    }
    return tagOptions
  }

  const selectExistTag = () => {
    return (
      <Form.Item name="existTags" label="tags">
        <Space

        // direction="vertical"
        >
          <Select
            mode="multiple"
            allowClear
            style={{
              width: '150px',
            }}
            optionFilterProp="label"
            placeholder="Please select"
            defaultValue={[]}
            // onChange={handleChange}
            options={processTagOptions()}
            onChange={handleAddExistTag}
          />
          <CheckOutlined
            onClick={() => {
              setSelectExistTagOpen(false)
              setAddTagButtonOpen(true)
              handleAddExistTagConfirm()
            }}
          />
          <CloseOutlined
            onClick={() => {
              setSelectExistTagOpen(false)
              setAddTagButtonOpen(true)
              handleAddExistTagCancel()
            }}

          />
          <PlusOutlined
            onClick={() => {
              setAddNewTagOpen(true)
              setSelectExistTagOpen(false)
            }}
          />
        </Space>
      </Form.Item>
    )
  };

  const addNewTagForm = () => {
    return (
      <Form.Item label="new tag">

        <Space key='newTag'>
          <Form.Item noStyle name='newTagName'>
            <Input placeholder="tag name" value="aaa" onChange={(e) => {
              addNewTagName = e.target.value
            }} />
          </Form.Item>
          <Form.Item noStyle name='newTagValue'>
            <Input placeholder="tag value" value={addNewTagValue} onChange={(e) => { addNewTagValue = e.target.value }} />
          </Form.Item>
          <CheckOutlined
            onClick={async () => {
              setAddNewTagOpen(false)
              setSelectExistTagOpen(true)
              let res = await http.post("/queryTag/checkTagAndCreate", { "tagName": addNewTagName, "tagValue": addNewTagValue })
              let newAddedTag = JSON.parse(JSON.stringify(res.data.data))
              let _modifiedTags = modifiedTags.concat()
              _modifiedTags.push(newAddedTag)
              setModifiedTags(
                _modifiedTags
              )

              //in case this tag is already in the option tag list
              for (let i = 0; i < existTagList.length; i++) {
                //console.log(existTagList[j])
                if (newAddedTag.tagId === existTagList[i]) {
                  //remove from exist tag list
                  let _existTagList = existTagList.concat()
                  _existTagList.splice(i, 1)
                  setExistTagList(_existTagList)
                  // console.log(modifiedData)
                }
              }


              resetAddNewTagForm()
            }}
          />
          <CloseOutlined
            onClick={() => {
              setAddNewTagOpen(false)
              setSelectExistTagOpen(true)
              resetAddNewTagForm()
            }}
          />
        </Space>
      </Form.Item>
    )
  };

  const addTggButton = () => {
    return (
      <Tag key='editTagButton' icon={<PlusOutlined />} onClick={() => {
        setSelectExistTagOpen(true)
        setAddTagButtonOpen(false)
      }}>
        Add Tag
      </Tag>
    )
  }






  return (

    <Layout>
      <Content>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: 'Home',
            },
            {
              title: 'Application Center',
              href: '',
            },
            {
              title: 'Application List',
              href: '',
            },
            {
              title: 'An Application',
            },
          ]}
          style={
            { marginBottom: '20px' }
          }
        />
        <Checkbox
          checked={componentDisabled}
          onChange={(e) => setComponentDisabled(e.target.checked)}
        >
          Form disabled
        </Checkbox>
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
          initialValues={{
            'ivtClassName': baseData.ivtClassName,
            'ivtSubclassCode': baseData.ivtSubclassCode,
            'ivtCatName': baseData.ivtCatName,
            'ivtQty': baseData.ivtQty,
            'ivtValue': baseData.ivtValue,
            'ivtPrice': baseData.ivtPrice,
            'ivtNote': baseData.ivtNote
          }}
        >
          <Form.Item name="ivtClassName" label="Name">
            <Input disabled={true} defaultValue="aaa" />
          </Form.Item>
          <Form.Item name="ivtSubclassCode" label="Code">
            <Input disabled={componentDisabled} />
          </Form.Item>
          <Form.Item name="ivtCatName" label="Category">
            <Input disabled={componentDisabled} />
          </Form.Item>
          <Form.Item name="ivtQty" label="Quantity">
            <InputNumber disabled={componentDisabled} />
          </Form.Item>
          <Form.Item name="ivtValue" label="Value">
            <InputNumber disabled={componentDisabled} />
          </Form.Item>
          <Form.Item name="ivtPrice" label="Price">
            <InputNumber disabled={componentDisabled} />
          </Form.Item>

          <Form.Item name="ivtNote" label="TextArea">
            <TextArea rows={4} disabled={componentDisabled} />
          </Form.Item>
          {/* <Form.Item label="Select">
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item> */}
          <Form.Item name="tags" label="tags">
            <Space size={[0, 8]} wrap>
              {
                modifiedTags.map(tagForMap)
              }
              {
                selectExistTagOpen === false ? <></> : selectExistTag()
              }
              {
                addNewTagOpen === false ? <></> : addNewTagForm()
              }
              {
                addTagButtonOpen === false ? <></> : addTggButton()
              }
              {/* <Tag closeIcon={<CloseCircleOutlined />} onClose={log}>
              Tag 2
            </Tag> */}
            </Space>
          </Form.Item>
          <Form.Item label="TreeSelect">
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
          </Form.Item>
          <Form.Item label="InputNumber">
            <InputNumber />
          </Form.Item>

          <Form.Item label="Switch" valuePropName="checked">
            <Switch />
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
export default IvtDetailPage