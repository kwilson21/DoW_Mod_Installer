import { useState } from "react";
import { Layout, Menu } from "antd";
import { SettingOutlined, HomeOutlined } from "@ant-design/icons";
import Mods from "../components/Mods";
import Settings from "../components/Settings";

import electron from "electron";
const unhandled =
  electron.remote || false ? require("electron-unhandled") : null;

if (unhandled) unhandled();

const { Header, Content, Footer, Sider } = Layout;

export default function WindowLayout() {
  const [key, setKey] = useState("1");

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <img
          src="/images/logo.png"
          width="80px"
          height="80px"
          style={{
            marginTop: "5px",
            marginBottom: "5px",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
          }}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[key]}
          onSelect={({ key }) => {
            setKey(key);
          }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Mods
          </Menu.Item>
          <Menu.Item key="2" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: 200, background: "#fff" }}
      >
        <Header
          className="site-layout-background"
          style={{ padding: 0, background: "#fff" }}
        />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center", background: "#fff" }}
          >
            {key === "1" && <Mods />}
            {key === "2" && <Settings />}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          DoW Mod Installer ©2020 Created by Kazon Wilson
        </Footer>
      </Layout>
    </Layout>
  );
}
