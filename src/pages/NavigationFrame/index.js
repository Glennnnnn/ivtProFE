import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useIvt } from '@/ivtFunc'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
const { Header, Sider } = Layout

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
        <div className="logo" />
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
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={pathname}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to="/">Menu</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/ivtlist">
              <Link to="/ivtlist">Inventory List</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/record">
              <Link to="/record">Operation history</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* outlet seems to be the place shows the children router context */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}


export default observer(NavigationFrame)