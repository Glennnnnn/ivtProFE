import React, { useEffect, useState } from "react"
import "./index.scss"

import ItemCreateForm from "./itemCreateForm";
import { Select, Card, Breadcrumb, Form, Button, Table, Tag, Space, Input, Layout, Menu, Popconfirm, Drawer, Row, Col } from "antd";
//import { Link } from "react-router-dom";
import {
  MailOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons'
//import img404 from '@/assets/error.png'
import { http } from "@/utils";
// import { Content } from "antd/es/layout/layout";


const IvtPage = () => {
  const { Sider, Content } = Layout;
  //const options = []
  const [searchTags, setSearchTags] = useState([])
  const [ivtResults, setIvtResults] = useState([])
  const [searchParas, setSearchParas] = useState({
    pageIndex: 1,
    pageSize: 10
  })
  const [ivtCount, setIvtCount] = useState()
  //drawer
  const [cartOpen, setCartOpen] = useState(false);
  //editForm
  const [editOpen, setEditOpen] = useState(false);
  const onEditCreate = (values) => {
    console.log('Received values of form: ', values);
    setEditOpen(false);
  };
  const [rowData, setRowData] = useState(
    //solve the fist loading with a null value issue
    { "ivtId": 1, "ivtClassName": "bolt", "ivtQty": 10, "tags": [{ "tagId": 5, "tagName": "wide", "tagValue": "15", "createTime": null, "updateTime": null, "createBy": 0, "updateBy": 0, "delFlag": 0 }, { "tagId": 1, "tagName": "long", "tagValue": "10", "createTime": null, "updateTime": null, "createBy": 0, "updateBy": 0, "delFlag": 0 }] }
  )

  const showDrawer = () => {
    setCartOpen(true);
  };
  const onClose = () => {
    setCartOpen(false);
  };
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const queryTags = async () => {
      const res = await http.get("/queryTag/querySearchInfo")
      setSearchTags(res.data.data)
    }
    queryTags()
  }, [])

  useEffect(() => {
    // console.log('index useeffect02')
    const queryResults = async () => {
      const res = await http.post("/ivt/queryIvtResultByInfo", {
        searchParas
      })
      setIvtResults(res.data.ivtResultPos)
      setIvtCount(res.data.totalCount)
    }
    queryResults()

  }, [searchParas])

  useEffect(() => {
    const catLEvelResult = async () => {
      const res = await http.get("/queryCategoryLevel")
      const origin = res.data.data
      // console.log(origin)

      // const items = getItem("Main", "main", <MailOutlined />, (function () {
      //   let ivtCatArr = [];
      //   for (let cat of origin) {
      //     ivtCatArr.push(getItem(cat['ivtCatName'], cat['ivtCatId'], null, (function () {
      //       let ivtClassArr = [];
      //       for (let ivtClass of cat['ivtClassPos']) {
      //         ivtClassArr.push(getItem(ivtClass['ivtClassName'], ivtClass['ivtClassId']))
      //       }
      //       return ivtClassArr
      //     })(), 'group'))
      //   }
      //   return ivtCatArr
      // })(), 'group')

      let meunResultArr = []
      const items = getItem("Main", "main", <MailOutlined />, (function () {
        let ivtCatArr = [];
        for (let cat of origin) {
          ivtCatArr.push(getItem(cat['ivtCatName'], cat['ivtCatId'], null, (function () {
            let ivtClassArr = [];
            for (let ivtClass of cat['ivtClassPos']) {
              ivtClassArr.push(getItem(ivtClass['ivtClassName'], ivtClass['ivtClassId']))
            }
            return ivtClassArr
          })(), null))
        }
        return ivtCatArr
      })(), 'group')
      meunResultArr.push(items)

      setMenuItems(meunResultArr)
    }
    catLEvelResult()
  }, [])

  const handleButtonClick = async (values) => {
    // console.log(values)
    const { ivtClassName, tags } = values
    setSearchParas({
      ...searchParas,
      ivtClassName,
      tags
    })

  }

  const handleMenuClick = (e) => {
    console.log(menuItems)
    console.log('click ', e);
  };

  const handlePageChange = (pageIndex) => {
    console.log(pageIndex)
    setSearchParas({
      ...searchParas,
      pageIndex
    })
  }
  //TODO delete an item from item table
  const handleDeleteItem = (ivtId) => {
    console.log(ivtId)
    const deleteResult = async () => {
      const res = await http.post("/ivt/deleteIvtById", { "ivtId": ivtId })
      console.log("delete " + res.data)
      setSearchParas({
        ...searchParas,
        pageIndex: 1
      })
    }
    deleteResult()

  }
  //left menu setting params
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  //left menu data
  // const items = [
  //   getItem('Navigation One', 'sub1', <MailOutlined />, [
  //     getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
  //     getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  //   ]),
  //   getItem('Navigation Two', 'sub2', null, [
  //     getItem('Option 5', '5'),
  //     getItem('Option 6', '6'),
  //     getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  //   ]),
  //   {
  //     type: 'divider',
  //   },
  //   getItem('Navigation Three', 'sub4', null, [
  //     getItem('Option 9', '9'),
  //     getItem('Option 10', '10'),
  //     getItem('Option 11', '11'),
  //     getItem('Option 12', '12'),
  //   ]),
  //   getItem('Group', 'grp', null, [
  //     getItem('Option 13', '13'),
  //     getItem('Option 14', '14')], 'group'),
  // ];

  // var rowData = {
  //   ivtId: "a"
  // };

  const columns = [
    // {
    //   title: 'image',
    //   dataIndex: 'cover',
    //   width: 120,
    //   render: cover => {
    //     return <img src={cover || img404} width={80} height={60} alt="" />
    //   }
    // },
    {
      title: 'Name',
      dataIndex: 'ivtClassName',
      width: 220
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags) => (
        <span>
          {tags.map((tag) => {
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
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'ivtQty',
      //render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: 'Operations',
      key: 'Operations',
      render: record => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                //console.log("click" + editOpen + ' index ' + index + '\n text ' + JSON.stringify(text) + ' \n record' + JSON.stringify(record))
                //console.log(' \n record' + JSON.stringify(record))
                // console.log("set new row" + JSON.stringify(rowData))
                setEditOpen(true)
                setRowData(record)
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<PlusCircleOutlined />}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<MinusCircleOutlined />}
            />
            <Popconfirm
              title="Sure to delete this item?"
              onConfirm={() => handleDeleteItem(record.ivtId)}
              okText="confirm"
              cancelText="cancel"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  return (
    <div className="ivt-layout">
      <ItemCreateForm
        open={editOpen}
        onCreate={onEditCreate}
        onCancel={() => {
          setEditOpen(false);
        }}
        rowData={rowData}
      />
      <Layout>
        <Content>
          <Card
            headStyle={{ height: '5%' }}
            bodyStyle={{ height: '85%', width: '100%' }}

          >
            <Form
              onFinish={handleButtonClick}
              initialValues={{ status: 'a', channel_id: 'a' }}>

              <Form.Item label="name" name={'ivtClassName'}>
                <Input
                  style={{ width: 240 }}
                  placeholder="please enter the name">
                </Input>
              </Form.Item>

              <Form.Item>
                <Space>
                  {
                    Object.keys(searchTags).map(searchTagName => {
                      const options = []
                      return (
                        <Form.Item
                          label={searchTagName}
                          name={['tags', searchTagName]}
                          key={searchTagName}>
                          {/* {tags[tagName].map(item => {
                      options.push({
                        value: item,
                        label: item
                      })
                      return null;
                    })} */}
                          {
                            searchTags[searchTagName].forEach(element => {
                              options.push({
                                value: element,
                                label: element
                              })
                            })
                          }
                          <Select
                            placeholder={searchTagName}
                            style={{ width: 120 }}
                            options={options}
                          ></Select>
                        </Form.Item>
                      )
                    })
                  }
                </Space>
                <Button type="primary" onClick={showDrawer}>
                  Open
                </Button>
                <Drawer
                  title="Check the variables."
                  width={720}
                  onClose={onClose}
                  open={cartOpen}
                  styles={{
                    body: {
                      paddingBottom: 80,
                    },
                  }}
                  extra={
                    <Space>
                      <Button onClick={onClose}>Cancel</Button>
                      <Button onClick={onClose} type="primary">
                        Submit
                      </Button>
                    </Space>
                  }
                >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label="Name"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter user name',
                            },
                          ]}
                        >
                          <Input placeholder="Please enter user name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="url"
                          label="Url"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter url',
                            },
                          ]}
                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                            addonBefore="http://"
                            addonAfter=".com"
                            placeholder="Please enter url"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Drawer>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
                  筛选
                </Button>
              </Form.Item>
            </Form>
            <Table
              rowKey={"ivtId"}
              columns={columns}
              dataSource={ivtResults}
              pagination={{
                position: ['bottomCenter'],
                current: searchParas.pageIndex,
                pageSize: searchParas.pageSize,
                total: ivtCount,
                onChange: handlePageChange
              }}
            />
          </Card>
        </Content>
      </Layout>
    </div >
  )
}

export default IvtPage