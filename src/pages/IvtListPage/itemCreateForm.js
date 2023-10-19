
import { Form, Input, Modal, Space, Tag } from 'antd';
import { useEffect } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';

function ItemCreateForm(props) {
  const [form] = Form.useForm();
  const { open, onCreate, onCancel, rowData } = props

  // console.log("1")
  // if (rowData != null) {
  //   form.setFieldsValue({
  //     ivtName: rowData.ivtName,
  //     ivtQty: rowData.ivtQty,
  //     tags: rowData.tags
  //   });

  // }
  const log = (e) => {
    console.log(e);
  };

  useEffect(() => {
    //console.log("use effect")

    //console.log(JSON.stringify(rowData))
    form.setFieldsValue({
      ivtName: rowData.ivtName,
      ivtQty: rowData.ivtQty,
      tags: rowData.tags
    });

  }, [rowData, form])
  // rowData = {
  //   a: 'a'
  // }
  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      focusTriggerAfterClose="false"
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
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

        <Form.Item name="tags" label="tags">
          <Space size={[0, 8]} wrap>
            {

              rowData.tags.map((tag) => {
                return (
                  <Tag key={tag.tagId} closeIcon={<CloseCircleOutlined />} onClose={log}>
                    {tag.tagName + ':' + tag.tagValue}
                  </Tag>
                )
              })

            }
            {/* <Tag closeIcon={<CloseCircleOutlined />} onClose={log}>
              Tag 2
            </Tag> */}
          </Space>
        </Form.Item>

      </Form>

    </Modal>
  );
};

export default ItemCreateForm;