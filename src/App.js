import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  LogoutOutlined,
  AppstoreTwoTone
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

import LoginPage from './pages/LoginPage/index.js'
import IvtInfoPage from "./pages/IvtInfoPage/index.js";
import DashboardPage from './pages/DashboardPage/index.js';
import OrderPage from './pages/OrderPage/index.js';
import HomePage from './pages/HomePage/index.js';
import { getToken, removeToken } from '@/utils'

//components
import './App.css';


const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const { token: { colorBgContainer },} = theme.useToken();
  const isAuthenticated = getToken();

  const handleLogout = () => {
    removeToken();
    // You can use window.location.href or any other navigation method
    window.location.href = '/login';
  };

  return (
    <Layout>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} style={{height: '100vh'}}>
        <div className="demo-logo-vertical" />
        
        {/* Company Icon and Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
          <AppstoreTwoTone style={{ fontSize: "50px" }} />
          {!collapsed && <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Pioneer Aluminium</span>}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['dashboard']}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => setSelectedMenu('dashboard')}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingOutlined />} onClick={() => setSelectedMenu('orders')}>
            <Link to="/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="inventory" icon={<FolderOpenOutlined />} onClick={() => setSelectedMenu('inventory')}>
            <Link to="/inventory">Inventory</Link>
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => setSelectedMenu('settings')}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
        
        <div style={{ position:'absolute', bottom: '20px', left: 0, width: '100%'}}>
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
            }}/>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedMenu.toUpperCase()}</span>
        </Header>
        <Content
          style={{
            margin: '16px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}>
          <Routes>
            <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/orders" element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" />} />
            <Route path="/inventory" element={isAuthenticated ? <IvtInfoPage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
