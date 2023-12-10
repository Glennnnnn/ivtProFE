import { Card, Form, Input, Button, Checkbox } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useIvt } from '@/store'

const LoginPage = () => {

  //解构 但到实例对象为止
  const { loginIvt } = useIvt();
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
        <img className="login-logo" src={logo} alt="" />
        <Form
          onFinish={onFinish}
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
            password: '12111'
          }}
        >
          <Form.Item
            label="username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
              // {
              //   pattern: /^\d{8,}$/,
              //   message: 'Incorrect format!',
              //   validateTrigger: 'onBlur'
              // }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              // {
              //   len: 8,
              //   message: 'Password is not longer than 8 characters!',
              //   validateTrigger: 'onBlur'
              // },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

      </Card>
    </div>
  )
}

export default LoginPage