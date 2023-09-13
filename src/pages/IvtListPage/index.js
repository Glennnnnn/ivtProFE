import React, { useEffect, useState } from "react"
import "./index.scss"

import { Select, Card, Breadcrumb, Form, Button, Table, Tag, Space } from "antd";
//import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
//import img404 from '@/assets/error.png'

import { http } from "@/utils";

function IvtListPage() {
  //const options = []
  const [searchTags, setSearchTags] = useState([])
  const [ivtResults, setIvtResults] = useState([])
  useEffect(() => {
    const queryTags = async () => {
      const res = await http.get("/queryTag/querySearchInfo")
      setSearchTags(res.data.data)
    }
    queryTags()
  }, [])

  useEffect(() => {
    const queryResults = async () => {
      const res = await http.post("/ivt/queryAllIvtInfo")
      setIvtResults(res.data)

    }
    queryResults()

  }, [])

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
        <Form initialValues={{ status: 'a', channel_id: 'a' }}>

          {
            Object.keys(searchTags).map(searchTagName => {
              const options = []
              return (
                <Form.Item label={searchTagName} name={searchTagName} key={searchTagName}>
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
                    placeholder="Please choose a tag type!"
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

      <Card title={`There is ${ivtResults.length} results：`}>
        <Table rowKey={"ivtId"} columns={columns} dataSource={ivtResults} />
      </Card>

    </div>
  )
}

export default IvtListPage