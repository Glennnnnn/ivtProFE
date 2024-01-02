import React, { useEffect, useState } from "react"
import "./index.scss"

import { Select, Card, Breadcrumb, Form, Button, Table, Tag, Space, Input, Layout, Drawer, Row, Col } from "antd";
import {
  FolderOutlined
} from '@ant-design/icons'
//import img404 from '@/assets/error.png'
import { http } from "@/utils";
import { NavLink } from "react-router-dom";


const IvtPage = () => {
  const { Content } = Layout;

  const [searchTags, setSearchTags] = useState([])
  const [ivtResults, setIvtResults] = useState([])
  const [searchParas, setSearchParas] = useState({
    pageIndex: 1,
    pageSize: 10
  })
  const [ivtCount, setIvtCount] = useState()

  const [cartOpen, setCartOpen] = useState(false);


  const showDrawer = () => {
    setCartOpen(true);
  };
  const onClose = () => {
    setCartOpen(false);
  };


  useEffect(() => {
    const queryTags = async () => {
      const res = await http.get("/queryTag/querySearchInfo")
      setSearchTags(res.data.data)
    }
    queryTags()
  }, [])

  useEffect(() => {

    const queryResults = async () => {
      const res = await http.post("/ivt/queryIvtResultByInfo", {
        searchParas
      })
      setIvtResults(res.data.ivtResultPos)
      setIvtCount(res.data.totalCount)
    }
    queryResults()

  }, [searchParas])

  const handleButtonClick = async (values) => {
    const { searchInfo, tags } = values
    setSearchParas({
      ...searchParas,
      searchInfo,
      tags
    })
  }

  const handlePageChange = (pageIndex, pageSize) => {
    console.log(pageIndex)
    setSearchParas({
      ...searchParas,
      pageIndex,
      pageSize
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'ivtClassName',
      width: 220,
      key: 'ivtClassName',
      render: (ivtClassName, record) => {
        // console.log(JSON.stringify(ivtClassName) + JSON.stringify(record))
        return <NavLink to='/ivtDetailPage' state={{ "ivtData": JSON.stringify(record), "prePage": "inventory" }} >{ivtClassName}</NavLink>
      }
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
      title: 'Code',
      dataIndex: 'ivtSubclassCode',
    },
    {
      title: 'Category',
      dataIndex: 'ivtCatName',
    },
    {
      title: 'Note',
      dataIndex: 'IvtNote',
    },
    {
      title: 'Quantity',
      dataIndex: 'ivtQty',

    },
    {
      title: 'Value',
      dataIndex: 'ivtValue',

    },
    {
      title: 'Price',
      dataIndex: 'ivtPrice',

    },
  ]

  return (
    <div className="ivt-layout">
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
                href: '',
              },
            ]}
            style={
              { marginBottom: '20px' }
            }
          />
          <div style={{ marginBottom: '20px' }}>
            <Row gutter={[16, 64]}>
              <Col span={12}>
                <Card
                  title={
                    <div><FolderOutlined /> Inventory details</div>
                  }
                  bordered={false}
                  style={{ height: '200px' }}>
                  {<div style={{ paddingLeft: '10px', position: 'absolute', top: '60%', left: '3%' }}>
                    <span style={{ fontSize: '20px' }}>All products</span><br />
                    <span style={{ fontSize: '30px' }}>000</span>
                  </div>}
                  {<div style={{ paddingRight: '10px', position: 'absolute', top: '60%', right: '10%' }}>
                    <span style={{ fontSize: '20px' }}>Active</span><br />
                    <span style={{ fontSize: '30px' }}>000</span>
                  </div>}
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <div><FolderOutlined /> Inventory details</div>
                  }
                  bordered={false}
                  style={{ height: '200px' }}>
                  {<div style={{ paddingLeft: '10px', position: 'absolute', top: '60%', left: '3%' }}>
                    <span style={{ fontSize: '20px' }}>All products</span><br />
                    <span style={{ fontSize: '30px' }}>000</span>
                  </div>}
                  {<div style={{ paddingRight: '10px', position: 'absolute', top: '60%', right: '10%' }}>
                    <span style={{ fontSize: '20px' }}>Active</span><br />
                    <span style={{ fontSize: '30px' }}>000</span>
                  </div>}
                </Card>
              </Col>
            </Row>
          </div>
          <Card
            headStyle={{ height: '5%' }}
            bodyStyle={{ height: '85%', width: '100%' }}

          >
            <Form
              onFinish={handleButtonClick}
              initialValues={{ status: 'a', channel_id: 'a' }}>

              <Form.Item label="search parameters" name={'searchInfo'}>
                <Input
                  style={{ width: 240 }}
                  placeholder="please enter the search parameters">
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