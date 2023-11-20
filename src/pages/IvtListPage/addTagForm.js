import { Modal } from "antd"
import { useEffect } from "react"

function AddTagForm(props) {
  const { addTagFormOpen, onAddTagFormCancel } = props
  useEffect(() => {
    console.log("AddTagForm " + addTagFormOpen)

  })
  return (
    <Modal
      open={addTagFormOpen}
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onAddTagFormCancel}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  )
}

export default AddTagForm