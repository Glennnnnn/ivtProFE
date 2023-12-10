import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  LogoutOutlined
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
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['dashboard']}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingOutlined />}>
            <Link to="/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="inventory" icon={<FolderOpenOutlined />}>
            <Link to="/inventory">Inventory</Link>
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
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
              fontSize: '16px',
              width: 64,
              height: 64,
            }}/>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
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
