import React, { useEffect, useState } from "react"
import { Outlet } from 'react-router-dom'
import "./index.scss"

import { Layout, Menu, Breadcrumb } from "antd";
//import { Link } from "react-router-dom";
import {
  MailOutlined
} from '@ant-design/icons'
//import img404 from '@/assets/error.png'
import { http } from "@/utils";
import { Content } from "antd/es/layout/layout";


const { Sider } = Layout

function IvtInfoPage() {
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const catLEvelResult = async () => {
      const res = await http.get("/queryCategoryLevel")
      const origin = res.data.data

      let meunResultArr = []
      const items = getItem("Folders", "main", <MailOutlined />, (function () {
        let ivtCatArr = [];
        for (let cat of origin) {
          ivtCatArr.push(getItem(cat['ivtCatName'], cat['ivtCatId'], null, (function () {
            // let ivtClassArr = [];
            // for (let ivtClass of cat['ivtClassPos']) {
            //   ivtClassArr.push(getItem(ivtClass['ivtClassName'], ivtClass['ivtClassId']))
            // }
            // return ivtClassArr
          })(), null))
        }
        return ivtCatArr
      })(), null)
      meunResultArr.push(items)

      setMenuItems(meunResultArr)
    }
    catLEvelResult()
  }, [])

  const handleMenuClick = (e) => {
    console.log(menuItems)
    console.log('click ', e);
  };

  //left menu setting params
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  return (
    <div className="ivt-layout">
      <Layout>
        <Sider
          width={200}
          style={{
            height: '100%'
          }}
          className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
            items={menuItems}
          >
          </Menu>
        </Sider>
        <Layout style={{
          padding: '0 24px 24px',
        }}>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
            items={[
              {
                title: 'Home',
              },
              {
                title: <a href="/ivtInfo/testPage">Application Center</a>,
              },
              {
                title: <a href="/ivtInfo/testPage">Application List</a>,
              },
              {
                title: 'An Application',
              },
            ]}
          />
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div >
  )
}

export default IvtInfoPage