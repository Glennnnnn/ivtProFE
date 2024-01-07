import { useLocation, NavLink, useNavigate } from 'react-router-dom';
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
  EditOutlined, CarOutlined, AccountBookOutlined, ShoppingCartOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react';
import { http } from "@/utils";
import moment from 'moment';

function IvtDetailPage() {

  let location = useLocation()
  let navigate = useNavigate()
  const { Content } = Layout;
  const ivtId = JSON.parse(location.state.ivtId)
  // const ivtId = Object.assign(({}, JSON.parse(location.state.ivtId)))
  //const baseData = Object.assign({}, recordData)
  const prePage = location.state.prePage

  const [baseData, setBaseData] = useState({})

  const [stockSource, setStockSource] = useState([]);
  const [stockCount, setStockCount] = useState()
  const [stockSearchParams, setStockSearchParams] = useState({
    ivtId: ivtId,
    pageIndex: 1,
    pageSize: 5
  })

  const [orderSource, setOrderSource] = useState([]);
  const [orderCount, setOrderCount] = useState()
  const [orderSearchParams, setOrderSearchParams] = useState({
    ivtId: ivtId,
    pageIndex: 1,
    pageSize: 5
  })
  useEffect(() => {
    const queryBasicDataAsync = async () => {
      let ivtJson = await http.get("/ivt/queryIvtResultById?ivtId=" + ivtId)
      let ivt = JSON.parse(JSON.stringify(ivtJson.data.data))
      setBaseData(ivt)
    }

    queryBasicDataAsync()
  }, [ivtId])

  useEffect(() => {
    const queryStockDataAsync = async () => {
      let stockJson = await http.post("/queryStockByIvtId", { stockSearchParams })
      let stock = JSON.parse(JSON.stringify(stockJson.data.data))
      setStockSource(stock.stockResponsePoList)
      setStockCount(stock.totalCount)
    }

    queryStockDataAsync()
  }, [stockSearchParams])

  useEffect(() => {
    const queryOrderDataAsync = async () => {
      let orderJson = await http.post("/queryOrderByIvtId", { orderSearchParams })
      let order = JSON.parse(JSON.stringify(orderJson.data.data))
      setOrderSource(order.orderIvtResponsePoList)
      setOrderCount(order.totalCount)
    }

    queryOrderDataAsync()
  }, [orderSearchParams])

  const handleOrderPageChange = ((pageIndex, pageSize) => {
    setOrderSearchParams({
      ...orderSearchParams,
      pageIndex,
      pageSize
    })
  });

  const handleStockPageChange = ((pageIndex, pageSize) => {
    setStockSearchParams({
      ...stockSearchParams,
      pageIndex,
      pageSize
    })
  });

  const navigateEdit = () => {
    let data = { "ivtData": JSON.stringify(baseData), "prePage": baseData.ivtClassName + " " + baseData.ivtSubclassCode }
    navigate("/ivtEditPage", { state: data });
  }
  const orderColumns = [
    {
      title: 'orderId',
      dataIndex: 'orderId',
      // width: 220,
      key: 'orderId',
      render: (orderId, record) => {
        const url = `/orderDetails?orderDBId=${record.orderDBId}`;
        return (
          <NavLink to={url}>
            {orderId}
          </NavLink>
        );
      },
    },
    {
      title: 'OrderStatus',
      dataIndex: 'orderStatus',
      // filters: [
      //   { text: 'active', value: 'active' },
      //   { text: 'inactive', value: 'inactive' },
      // ],
      render: (status) => (
        <span>
          <Tag color={status === "processing" ? 'orange' :
            (status === "reversed" ? 'red' : 'green')}> {status} </Tag>
        </span>
      ),
      width: 300,
    },
    {
      title: 'Inventory Price',
      dataIndex: 'orderIvtPrice',
      width: 100,
      render: (_, record) => {
        const formattedTotal = _.toFixed(2);
        return ` ${formattedTotal}`;
      },
      // width: 220,
    },
    {
      title: 'Inventory Quantity',
      dataIndex: 'orderIvtQty',
      width: 100
    },
    {
      title: 'Inventory Total',
      dataIndex: 'orderIvtTotal',
      width: 100,
      render: (_, record) => {
        const formattedTotal = _.toFixed(2);
        return ` ${formattedTotal}`;
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'createDate',
      width: 300,
      render: (text, record) => {
        return (
          moment(text).format('DD/MM/YYYY')
        )
      }
    },
    {
      title: 'Operator',
      dataIndex: 'createBy',
      width: 300,
    },
  ]

  const stockColumns = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      width: 200,
      render: (orderId, record) => {
        if (record.orderDBId === null) {
          return ({ orderId });
        }
        const url = `/orderDetails?orderDBId=${record.orderDBId}`;
        return (
          <NavLink to={url}>
            {orderId}
          </NavLink>
        );
      },
    },
    {
      title: 'Stock Amount',
      dataIndex: 'stockOptAmount',
      width: 200,
    },
    {
      title: 'Stock Type',
      dataIndex: 'stockOptType',
      // filters: [
      //   { text: 'sale', value: 'sale' },
      //   { text: 'reverse sale', value: 'reverse sale' },
      //   { text: 'restock', value: 'restock' },
      //   { text: 'reduce stock', value: 'reduce stock' },
      // ],
      // onFilter: (value) => {
      //   console.log(value + 1)
      // },
      render: (status) => (
        <span>
          <Tag color={status === "reverse sale" || status === "reduce stock" ? 'green' : 'volcano'}> {status} </Tag>
        </span>
      ),
    },
    {
      title: 'Stock Date',
      dataIndex: 'createTime',
      width: 300,
      // render: (text, record) => {
      //   return (
      //     moment(text).format('DD/MM/YYYY')
      //   )
      // }
    },
    {
      title: 'Operator',
      dataIndex: 'createBy',
      width: 300,
    },
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
                if (prePage === 'inventory') {
                  return prePage.toLowerCase().replace(/\b([\w|']+)\b/g, function (word) {
                    //return word.slice(0, 1).toUpperCase() + word.slice(1);  
                    return word.replace(word.charAt(0), word.charAt(0).toUpperCase()) + ' List';
                  });
                }
              })(),
              href: '/' + prePage,
            },
            {
              title: baseData?.ivtClassName + " " + baseData?.ivtSubclassCode
            }
          ]}
          style={
            { marginBottom: '20px' }
          }
        />
        <div style={{ display: 'flex', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
          <div style={{ marginLeft: 'auto' }}>
            <Button type="default" size="large" className="edit-customer-details-button" onClick={navigateEdit}><EditOutlined /><NavLink to='/ivtEditPage' state={{ "ivtData": JSON.stringify(baseData), "prePage": baseData.ivtClassName + " " + baseData.ivtSubclassCode }} width={"100%"} >Edit</NavLink></Button>
            {/* <Button danger icon={<DeleteOutlined />} size="large" className="edit-customer-details-button"> Inactive</Button> */}
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
                      {baseData?.ivtClassName}
                    </Col>

                    {/* <Col span={6}>
                      <Tag color={recordData.delFlag === "active" ? 'green' : 'volcano'}> {recordData.delFlag}</Tag>
                    </Col> */}
                  </Row>}
                bordered={false}
                style={{ height: 'auto' }}>
                <Row gutter={[16, 16]}>
                  <Col span={14}>
                    <span>
                      {baseData?.tags?.map((tag) => {
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
            rowKey={"orderIvtId"}
            columns={orderColumns}
            dataSource={orderSource}
            pagination={{
              position: ['bottomCenter'],
              current: orderSearchParams.pageIndex,
              pageSize: orderSearchParams.pageSize,
              total: orderCount,
              onChange: handleOrderPageChange
            }}
          />
        </Card>
        <Card headStyle={{ height: '5%' }} bodyStyle={{ height: '85%', width: '100%' }}>
          <Table
            title={() => 'Stock History'}
            rowKey={"stockId"}
            columns={stockColumns}
            dataSource={stockSource}
            pagination={{
              position: ['bottomCenter'],
              current: stockSearchParams.pageIndex,
              pageSize: stockSearchParams.pageSize,
              total: stockCount,
              onChange: handleStockPageChange
            }}

          />
        </Card>
      </Content>
    </div>


  )
}

export default IvtDetailPage