import React, { useEffect, useState } from "react"
import "./index.scss"

import { Select, Card, Breadcrumb, Form, Button, Table, Tag, Space } from "antd";
//import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { http } from "@/utils";

function IvtListPage() {
  //const options = []
  const [tags, setTags] = useState([])
  useEffect(() => {
    const queryTags = async () => {
      const res = await http.get("/queryTag/querySearchInfo")
      setTags(res.data.data)
    }
    queryTags()
  }, [])

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
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

  const data = [
    {
      id: '8218',
      comment_count: 0,
      cover: {
        images: ['http://geek.itheima.net/resources/images/15.jpg'],
      },
      like_count: 0,
      pubdate: '2019-03-11 09:00:00',
      read_count: 2,
      status: 2,
      title: 'wkwebview离线化加载h5资源解决方案'
    }
  ]

  return (
    <div>
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
        style={{ marginBottom: 20 }}
      >

        {/* <div>
          {
            Object.keys(tags).map(tagName => {
              return (
                <div key={tagName}>{tagName}
                  {
                    tags[tagName].map(item => {
                      return (<div key={item}>{item}</div>)
                    })
                  }
                </div>
              )
            })
          }
        </div> */}
        <Form initialValues={{ status: 'a', channel_id: 'a' }}>

          {
            Object.keys(tags).map(tagName => {
              const options = []
              return (
                <Form.Item label={tagName} name={tagName} key={tagName}>
                  {/* {tags[tagName].map(item => {
                    options.push({
                      value: item,
                      label: item
                    })
                    return null;
                  })} */}
                  {
                    tags[tagName].forEach(element => {
                      options.push({
                        value: element,
                        label: element
                      })
                    })
                  }
                  <Select
                    placeholder="Pleasechoose a tag type!"
                    style={{ width: 120 }}
                    options={options}
                  ></Select>
                </Form.Item>

              )
            })
          }

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={`根据筛选条件共查询到 count 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card>

    </div>
  )
}

export default IvtListPage