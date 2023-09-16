import React, { useEffect, useState } from "react"
import "./index.scss"

import { Select, Card, Breadcrumb, Form, Button, Table, Tag, Space, Input, Layout, Menu } from "antd";

//import { Link } from "react-router-dom";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
//import img404 from '@/assets/error.png'
import { http } from "@/utils";
const { Sider } = Layout
function IvtListPage() {
  //const options = []
  const [searchTags, setSearchTags] = useState([])
  const [ivtResults, setIvtResults] = useState([])
  const [searchParas, setSearchParas] = useState({
    pageIndex: 1,
    pageSize: 10
  })
  const [ivtCount, setIvtCount] = useState()

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
    console.log(values)
    const { ivtName, tags } = values
    setSearchParas({
      ...searchParas,
      ivtName,
      tags
    })

  }

  const handlePageChange = (pageIndex) => {
    console.log(pageIndex)
    setSearchParas({
      ...searchParas,
      pageIndex
    })
  }

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
      dataIndex: 'ivtName',
      width: 220
    },
    {
      title: 'Quantity',
      dataIndex: 'ivtQty',
      //render: data => <Tag color="green">审核通过</Tag>
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
      title: 'Operations',
      key: 'Operations',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Space>
        )
      }
    }
  ]

  return (
    <div className="ivt-layout">
      <Layout>
        <Sider width={200} style={{
          height: '100%'
        }}
          className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="1">
              数据概览
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="2">
              内容管理
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="3">
              发布文章
            </Menu.Item>
          </Menu>
        </Sider>

        <Card
          title={
            <Breadcrumb separator=">"
              items={[
                {
                  title: 'Home',
                },
                {
                  title: 'Inventory management',
                  href: ''
                }
              ]}>

            </Breadcrumb>
          }
          headStyle={{ height: '5%' }}
          bodyStyle={{ height: '85%', width: '100%' }}

        >
          <Form
            onFinish={handleButtonClick}
            initialValues={{ status: 'a', channel_id: 'a' }}>

            <Form.Item label="name" name={'ivtName'}>
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
      </Layout>
    </div >
  )
}

export default IvtListPage