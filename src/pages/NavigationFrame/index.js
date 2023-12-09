import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useIvt } from '@/store'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
const { Header } = Layout

const NavigationFrame = () => {
  const { pathname } = useLocation()
  const { ivtUser, loginIvt } = useIvt()

  useEffect(() => {
    ivtUser.getUserInfo()
  }, [ivtUser])

  const navigate = useNavigate()
  const onConfirm = () => {
    loginIvt.logout()
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        {/* <img className="logo" src={logo}></img> */}
        {/* <div className="logo" /> */}
        <Menu
          mode="horizontal"
          theme="dark"
          defaultSelectedKeys={pathname}
          style={{
            margin: 'absolute'
          }}
        >
          <Menu.Item icon={<HomeOutlined />} key="/">
            <Link to="/">Menu</Link>
          </Menu.Item>
          <Menu.Item icon={<DiffOutlined />} key="/ivtinfo">
            <Link to="/ivtinfo">Inventory List</Link>
          </Menu.Item>
          <Menu.Item icon={<EditOutlined />} key="/record">
            <Link to="/record">Operation history</Link>
          </Menu.Item>
        </Menu>
        <div className="user-info">
          <span className="user-name">{ivtUser.userInfo.username}</span>
          <span className="user-logout">
            <Popconfirm
              onConfirm={onConfirm}
              title="Sure to logout？" okText="logout" cancelText="cancel">
              <LogoutOutlined /> Logout
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Layout className="layout-content" style={{
          margin: 0,
          padding: 0
        }}>
          {/* outlet seems to be the place shows the children router context */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}


export default observer(NavigationFrame)