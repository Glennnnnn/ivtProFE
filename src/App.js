import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  AppstoreTwoTone
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

import LoginPage from './pages/LoginPage/index.js'
import IvtPage from "./pages/IvtInfoPage/ivtPage.js";
import DashboardPage from './pages/DashboardPage/index.js';
import OrderPage from './pages/OrderPage/index.js';
import CustomerPage from './pages/CustomerPage/index.js';
import CustomerDetailsPage from './pages/CustomerPage/customerDetailPage.js';
import HomePage from './pages/HomePage/index.js';
import IvtCreatePage from './pages/IvtInfoPage/ivtCreatePage.js';
import IvtDetailPage from './pages/IvtInfoPage/ivtDetailPage.js';
import IvtEditPage from './pages/IvtInfoPage/ivtEditPage.js';
import { getToken, removeToken } from '@/utils'

//components
import './App.css';
import NewOrderPage from './pages/OrderPage/newOrder.js';


const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const { token: { colorBgContainer }, } = theme.useToken();
  const isAuthenticated = getToken();
  useEffect(() => {
    setSelectedMenu(window.location.pathname.split('/')[1])
  }, [])

  const handleLogout = () => {
    removeToken();
    // You can use window.location.href or any other navigation method
    window.location.href = '/login';
  };

  const setMenu = (menuName) => {
    setSelectedMenu(menuName)
  }

  return (
    <Layout>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} style={{ height: '100vh' }}>
        <div className="demo-logo-vertical" />

        {/* Company Icon and Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
          <AppstoreTwoTone style={{ fontSize: "50px" }} />
          {!collapsed && <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Pioneer Aluminium</span>}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[window.location.pathname.split('/')[1]]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => setMenu('dashboard')}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingOutlined />} onClick={() => setMenu('orders')}>
            <Link to="/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="customers" icon={<TeamOutlined />} onClick={() => setMenu('customers')}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          <Menu.Item key="inventory" icon={<FolderOpenOutlined />} onClick={() => setMenu('inventory')}>
            <Link to="/inventory">Inventory</Link>
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => setMenu('settings')}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>

        <div style={{ position: 'absolute', bottom: '20px', left: 0, width: '100%' }}>
          <Menu
            theme="light"
            mode="inline" >
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '20px',
              width: 64,
              height: 64,
            }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedMenu.toUpperCase()}</span>
        </Header>
        <Content
          style={{
            margin: '16px 16px',
            padding: 12,
            minHeight: 280,
            background: colorBgContainer,
          }}>
          <Routes>
            <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/orders" element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" />} />
            <Route path="/neworder" element={isAuthenticated ? <NewOrderPage /> : <Navigate to="/login" />} />
            <Route path='/customers' element={isAuthenticated ? <CustomerPage /> : <Navigate to="/login" />} />
            <Route path='/customerDetails' element={isAuthenticated ? <CustomerDetailsPage /> : <Navigate to="/login" />} />
            <Route path="/inventory" element={isAuthenticated ? <IvtPage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/ivtCreatePage" element={isAuthenticated ? <IvtCreatePage /> : <Navigate to="/ivtCreatePage" />} />
            <Route path='/ivtEditPage' element={isAuthenticated ? <IvtEditPage /> : <Navigate to="/login" />} />
            <Route path="/ivtDetailPage" element={isAuthenticated ? <IvtDetailPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
