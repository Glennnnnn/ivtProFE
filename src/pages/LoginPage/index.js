import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Checkbox } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import logo from '@/assets/logo.png'
import './index.scss'
import { useIvt } from '@/store'

const LoginPage = () => {

  //解构 但到实例对象为止
  const { loginIvt } = useIvt();
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);

  // To disable submit button at the beginning.
  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = async (values) => {
    const { username, password } = values
    try {
      await loginIvt.login({ username, password })
      window.location.href = '/';
    } catch (e) {
      console.log(e.response?.data?.message || '登录失败')
    }
  }

  return (
    <div className="login">
      <Card className="login-container">
        <div className='login-div'>
          <img className="login-logo" src={logo} alt="" />
          <span style={{ fontSize: '25px', fontWeight: 'bold' }}>Welcome Back! </span>
          <span style={{ fontSize: '18px', fontWeight: 'normal' }}>Login to your account</span>
        </div>
        <Form name={form} className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]} >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password" />
          </Form.Item>
          <div className='login-div'>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  className='login-button'
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !clientReady ||
                    !form.isFieldsTouched(true) ||
                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                  }> Log in</Button> )}
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage