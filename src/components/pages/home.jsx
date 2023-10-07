import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    FileOutlined,
    LogoutOutlined, // Import LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import '../styles/home.css';

const { Header, Sider, Content } = Layout;

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [user, loading, error] = useAuthState(auth);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const handleLogout = () => {
        auth.signOut(); // Foydalanuvchini tizimdan chiqish
    };

    if (loading) {
        return <center><h2>Loading...</h2></center>;
    }

    if (error) {
        return <h2>Error: {error.message}</h2>;
    }

    return (
        <div>
            <Layout className='home'>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className='demo-logo-vertical' />
                    <Menu
                        className='home-menu'
                        theme='dark'
                        mode='inline'
                        defaultSelectedKeys={['1']}
                    >
                        <Menu.Item key='1' icon={<UserOutlined />}>
                            Home
                        </Menu.Item>
                        <Menu.Item key='2' icon={<FileOutlined />}>
                            Files
                        </Menu.Item>
                        <Menu.Item key='3' icon={<UploadOutlined />}>
                            Upload
                        </Menu.Item>
                        <Menu.Item key='4' icon={<LogoutOutlined />} onClick={handleLogout}>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    >
                        <Button
                            type='text'
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
                        }}
                    >
                        <h1 className='home-title'>Hello {email ? email : 'none'}</h1>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default Home;
