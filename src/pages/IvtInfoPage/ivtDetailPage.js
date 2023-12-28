import { useLocation, NavLink } from 'react-router-dom';
import {
  Layout,
  Breadcrumb,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Table,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, CarOutlined, AccountBookOutlined, ShoppingCartOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react';
function IvtDetailPage() {

  let location = useLocation()
  const { Content } = Layout;
  const recordData = JSON.parse(location.state.ivtData)
  const baseData = Object.assign({}, recordData)
  const prePage = location.state.prePage
  const [orderDataSource, setOrderDataSource] = useState([]);
  const [restockSource, setRestockSource] = useState([]);

  useEffect(() => {
    console.log(baseData)
  })

  const [orderSearchParams, setOrderSearchParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  })
  const [restockSearchParams, setRestockSearchParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  })


  const handleOrderPageChange = ((pagination, filters, sorter) => {
    if (pagination.pageSize !== orderSearchParams.pagination?.pageSize) {
      pagination.current = 1;
      setOrderDataSource([]);
    }

    setOrderSearchParams({
      pagination,
      filters,
      ...sorter,
    });
  });
  const handleRestockPageChange = ((pagination, filters, sorter) => {
    if (pagination.pageSize !== restockSearchParams.pagination?.pageSize) {
      pagination.current = 1;
      setRestockSource([]);
    }

    setRestockSearchParams({
      pagination,
      filters,
      ...sorter,
    });
  });
  const orderColumns = [
    {
      title: 'orderId',
      dataIndex: 'orderId',
      // width: 220,
      key: 'orderId',
      render: (orderId, record) => {
        return <NavLink>{orderId}</NavLink>
      }
    },
    {
      title: 'Order Price',
      dataIndex: 'orderPrice',
      // width: 220,
    },
    {
      title: 'Order Quantity',
      dataIndex: 'orderQty',
    },
    {
      title: 'Order Discount',
      dataIndex: 'orderDiscount',
    },
    {
      title: 'Order Date',
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'delFlag',
      filters: [
        { text: 'active', value: 'active' },
        { text: 'inactive', value: 'inactive' },
      ],
      render: (status) => (
        <span>
          <Tag color={status === "active" ? 'green' : 'volcano'}> {status} </Tag>
        </span>
      ),
    }
  ]

  const restockColumns = [
    {
      title: 'Restock Id',
      dataIndex: 'restockId',
      width: 220,
      key: 'orderId',
      render: (orderId, record) => {
        return <NavLink>{orderId}</NavLink>
      }
    },
    {
      title: 'Restock Date',
      dataIndex: 'restockDate',
      width: 220,
    },
    {
      title: 'Quantity',
      dataIndex: 'restocQty',
    },
    {
      title: 'Restock Type',
      dataIndex: 'restockType',
      filters: [
        { text: 'instock', value: 'instock' },
        { text: 'offstock', value: 'instock' },
      ],
      render: (status) => (
        <span>
          <Tag color={status === "instock" ? 'green' : 'volcano'}> {status} </Tag>
        </span>
      ),
    }
  ]



  return (
    <div className="ivt-layout">
      <Content style={{ margin: '10px' }}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: 'Home',
              href: '/'
            },
            {
              title: (function () {
                return prePage.toLowerCase().replace(/\b([\w|']+)\b/g, function (word) {
                  //return word.slice(0, 1).toUpperCase() + word.slice(1);  
                  return word.replace(word.charAt(0), word.charAt(0).toUpperCase()) + ' List';
                });
              })(),
              href: '/' + prePage,
            },
            {
              title: baseData.ivtClassName + " " + baseData.ivtSubclassCode
            }
          ]}
          style={
            { marginBottom: '20px' }
          }
        />
        <div style={{ display: 'flex', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
          <div style={{ marginLeft: 'auto' }}>
            <Button type="default" size="large" className="edit-customer-details-button" ><EditOutlined /><NavLink to='/ivtEditPage' state={{ "ivtData": JSON.stringify(recordData), "prePage": baseData.ivtClassName + " " + baseData.ivtSubclassCode }} >Edit</NavLink></Button>
            <Button danger icon={<DeleteOutlined />} size="large" className="edit-customer-details-button"> Inactive</Button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 64]}>
            <Col span={8}>
              <Card
                title={
                  <Row>
                    <Col span={2}>
                      <ShoppingCartOutlined />
                    </Col>
                    <Col span={8}>
                      {baseData.ivtClassName}
                    </Col>
                    <Col span={14}>
                      <span>
                        {baseData.tags.map((tag) => {
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
                    </Col>
                    {/* <Col span={6}>
                      <Tag color={recordData.delFlag === "active" ? 'green' : 'volcano'}> {recordData.delFlag}</Tag>
                    </Col> */}
                  </Row>}
                bordered={false}
                style={{ height: 'auto' }}>
                <Row gutter={[16, 16]}>

                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <Row>
                    <Col span={2}>
                      <CarOutlined />
                    </Col>
                    <Col span={18}>
                      Basic information
                    </Col>
                  </Row>}
                bordered={false}
                style={{ height: 'auto' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Code</span><br />
                    <span style={{ fontSize: '12px' }}>{baseData.ivtSubclassCode}</span>
                  </Col>
                  <Col span={12}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Price</span><br />
                    <span style={{ fontSize: '12px' }}>{baseData.ivtPrice}</span>
                  </Col>
                  <Col span={12}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Quantity</span><br />
                    <span style={{ fontSize: '12px' }}>{baseData.ivtQty}</span>
                  </Col>
                  <Col span={12}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Value</span><br />
                    <span style={{ fontSize: '12px' }}>{baseData.ivtValue}</span>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <Row>
                    <Col span={2}>
                      <AccountBookOutlined />
                    </Col>
                    <Col span={18}>
                      Notes
                    </Col>
                  </Row>}
                bordered={false}
                style={{ height: 'auto', minHeight: '200px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Note</span><br />
                    <span style={{ fontSize: '12px' }}>{baseData.ivtNote}</span>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
          <Table
            title={() => 'Orders'}
            rowKey={"orderId"}
            columns={orderColumns}
            dataSource={orderDataSource}
            pagination={orderSearchParams.pagination}
            // loading={loading}
            onChange={handleOrderPageChange}
          />
        </Card>
        <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
          <Table
            title={() => 'Restock History'}
            rowKey={"restockId"}
            columns={restockColumns}
            dataSource={restockSource}
            pagination={restockSearchParams.pagination}
            // loading={loading}
            onChange={handleRestockPageChange}
          />
        </Card>
      </Content>
    </div>


  )
}

export default IvtDetailPage