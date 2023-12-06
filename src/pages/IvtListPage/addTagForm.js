import { Modal, Form, Input } from "antd"
import { useEffect } from "react"

function AddTagForm(props) {
  const [form] = Form.useForm();
  const { addTagFormOpen, onAddTagFormCancel, onAddTagOk } = props
  useEffect(() => {
    console.log("AddTagForm " + addTagFormOpen)

  })
  return (
    <Modal
      title="Create a new tag"
      open={addTagFormOpen}
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onAddTagFormCancel}
      //focusTriggerAfterClose="false"
      destroyOnClose="true"
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            console.log(values)
            onAddTagOk(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          label="Tag name"
          name="tagName"
          rules={[
            {
              required: true,
              message: 'Please input a tag name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tag value"
          name="tagValue"
          rules={[
            {
              required: true,
              message: 'Please input a tag name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddTagForm