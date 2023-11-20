
import { Form, Input, Modal, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import AddTagForm from './addTagForm';

function ItemCreateForm(props) {
  const [form] = Form.useForm();
  const { open, onCreate, onCancel, rowData } = props

  const [rowtags, setRowTags] = useState(rowData.tags)
  const [delTagArray, setDelTagArray] = useState([])

  //addTagFrom component variables and functions
  const [addTagFormOpen, setAddTagFormOpen] = useState(false)

  //const tagDeleteLsit = []
  // console.log("1")
  // if (rowData != null) {
  //   form.setFieldsValue({
  //     ivtName: rowData.ivtName,
  //     ivtQty: rowData.ivtQty,
  //     tags: rowData.tags
  //   });

  // }
  // const editTagList = []
  // const deleteTagList = []
  // const updateList = []

  const printMethod = () => {
    console.log("print")
    console.log(delTagArray);
    //editTagList.push("a")
  }

  // const clickEvent = (e) => {
  //   // console.log(e);
  //   // console.log(rowtags)
  //   // console.log(tagChild)

  //   // deleteTagList.push()
  //   // console.log(deleteTagList)
  // };

  const handleCancel = () => {
    onCancel()
    //clean the delete array
    setDelTagArray([])
  }

  const handleTagClose = (removedTag) => {
    const newTags = rowtags.filter((tag) => tag !== removedTag);
    //console.log(newTags);
    setRowTags(newTags);
    console.log(removedTag)
    setDelTagArray([
      ...delTagArray,
      removedTag
    ])
  };

  const handleAddTag = () => {
    setAddTagFormOpen(true)
    console.log(addTagFormOpen)
  }

  const tagForMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        onClick={printMethod}
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

  const tagChild = rowtags.map(tagForMap);

  useEffect(() => {
    console.log("use effect")
    // console.log("the delArray is " + delTagArray)
    //console.log(JSON.stringify(rowData))
    form.setFieldsValue({
      ivtName: rowData.ivtName,
      ivtQty: rowData.ivtQty,
      tags: rowData.tags
    });

    setRowTags(rowData.tags)
    //console.log(rowData.tags)
  }, [rowData, form, open])
  // rowData = {
  //   a: 'a'
  // }


  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={handleCancel}
      focusTriggerAfterClose="false"
      // if this property is not added, each time user delete a tag an cancel it, this tag will not be shown in the next click event. 
      destroyOnClose="true"
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            //form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        name="ivtForm"
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="ivtName"
          label="ivtName"
        // rules={[
        //   {
        //     required: true,
        //     message: 'Please input the title of collection!',
        //   },
        // ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ivtQty"
          label="ivtQty"
        // rules={[
        //   {
        //     required: true,
        //     message: 'Please input the title of collection!',
        //   },
        // ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item name="tags" label="tags">
          <Input type="textarea" />
        </Form.Item> */}
        {/* <Form.Item name="tags" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item> */}

        {/* TODO tag part of the form */}
        <Form.Item name="tags" label="tags">
          <Space size={[0, 8]} wrap>
            {/* {
              rowData.tags.map((tag) => {
                return (
                  <Tag key={tag.tagId} closeIcon={<CloseCircleOutlined />} onClose={clickEvent}>
                    {tag.tagName + ':' + tag.tagValue}
                  </Tag>
                )
              })
            } */}
            {tagChild}
            <Tag key='editTagButton' icon={<PlusOutlined />} onClick={handleAddTag}>
              Add Tag
            </Tag>
            {/* <Tag closeIcon={<CloseCircleOutlined />} onClose={log}>
              Tag 2
            </Tag> */}
          </Space>
        </Form.Item>
      </Form>
      <AddTagForm
        addTagFormOpen={addTagFormOpen}
        onAddTagFormCancel={() => { setAddTagFormOpen(false) }}
      />
    </Modal>
  );
};

export default ItemCreateForm;