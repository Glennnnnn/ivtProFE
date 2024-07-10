import React, { useEffect, useState } from "react"
import "./index.scss"

import { Card, Breadcrumb, Table, Tag, Input, Layout, Row, Col } from "antd";
import {
  FolderOutlined
} from '@ant-design/icons'
//import img404 from '@/assets/error.png'
import { http } from "@/utils";
import { NavLink } from "react-router-dom";


const IvtPage = () => {
  const { Content } = Layout;

  //along with tag search, deprecated
  // const [searchTags, setSearchTags] = useState([])

  const [ivtResults, setIvtResults] = useState([])
  const [searchParas, setSearchParas] = useState({
    pageIndex: 1,
    pageSize: 20
  })
  const [ivtCount, setIvtCount] = useState()

  // search tags data, deprecated
  // useEffect(() => {
  //   const queryTags = async () => {
  //     const res = await http.get("/queryTag/querySearchInfo")
  //     setSearchTags(res.data.data)
  //   }
  //   queryTags()
  // }, [])

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
    let searchInfo = values
    setSearchParas({
      ...searchParas,
      pageIndex: 1,
      searchInfo,
    })
  }

  const handlePageChange = (pageIndex, pageSize) => {
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
        return (
          <>
            <NavLink to='/ivtDetailPage' state={{ "prePage": "inventory", "ivtId": JSON.stringify(record.ivtId) }} >
              {ivtClassName + " "}
            </NavLink>
            {record.delFlag === 1 && <Tag color={'black'} > Unavailable </Tag>}
            {record.ivtQty <= record.lowStockAlertAmount && <Tag color={'red'} key={record.ivtId}> Low Stock </Tag>}
          </>
        )
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
      title: 'Note',
      dataIndex: 'ivtNote',
    },
    {
      title: 'Quantity',
      dataIndex: 'ivtQty',

    },
    {
      title: 'Price',
      dataIndex: 'ivtPrice',
      render: (_, record) => {
        const formattedTotal = _.toFixed(2);
        return ` ${formattedTotal}`;
      },
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

          {/* <Flex align="flex-end" justify="flex-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              href="/ivtCreatePage"
              className="new-customer-button"
            >
              New Inventory
            </Button>
          </Flex> */}


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
                    <span style={{ fontSize: '30px' }}>{ivtCount}</span>
                  </div>}
                  {<div style={{ paddingRight: '10px', position: 'absolute', top: '60%', right: '10%' }}>
                    <span style={{ fontSize: '20px' }}>Active</span><br />
                    <span style={{ fontSize: '30px' }}>{ivtCount}</span>
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
                    <span style={{ fontSize: '30px' }}>{ivtCount}</span>
                  </div>}
                  {<div style={{ paddingRight: '10px', position: 'absolute', top: '60%', right: '10%' }}>
                    <span style={{ fontSize: '20px' }}>Active</span><br />
                    <span style={{ fontSize: '30px' }}>{ivtCount}</span>
                  </div>}
                </Card>
              </Col>
            </Row>
          </div>
          <Card
            headStyle={{ height: '5%' }}
            bodyStyle={{ height: '85%', width: '100%' }}

          >
            <Row justify={"end"}>
              <Col>
                <Input.Search
                  placeholder="Search Inventory"
                  onSearch={handleButtonClick}
                  enterButton
                  style={{ width: 320, marginBottom: 20 }}
                />
              </Col>
            </Row>
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