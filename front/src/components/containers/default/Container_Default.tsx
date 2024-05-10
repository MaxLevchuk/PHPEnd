import React, { useContext, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext.tsx";

const { Header, Sider, Content } = Layout;

const ContainerDefault: React.FC = () => {
    const { isAuth } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const { colorBgContainer, borderRadiusLG } = theme.useToken().token;

    const menuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Home', link: '/' },
        { key: '2', icon: <VideoCameraOutlined />, label: 'Add Category', link: '/create' },
        { key: '3', icon: <UserOutlined />, label: 'Register', link: '/register' },
        { key: '4', icon: <UserOutlined />, label: 'Products', link: '/products' },
        { key: '5', icon: <UserOutlined />, label: 'Create Product', link: '/product/create' },
        isAuth === false
            ? { key: '6', icon: <UserOutlined />, label: 'Login', link: '/login' }
            : { key: '7', icon: <UserOutlined />, label: 'Logout', link: '/leave' }
    ];

    return (
        <Layout style={{ height: "100%" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                >
                    {menuItems.map(item => (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.link}>{item.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default ContainerDefault;
