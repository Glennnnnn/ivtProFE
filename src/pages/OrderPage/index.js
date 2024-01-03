import React from 'react';
import "./index.scss"

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';

const OrderPage = () => {
  return (
    <div>
      <h2>Orders Content</h2>
      <div style={{ display: 'flex', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
        <div style={{ marginLeft: 'auto' }}>
          <Button type="primary" icon={<PlusOutlined />} size="large" className="new-customer-button">
            <Link to="/neworder">New Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;