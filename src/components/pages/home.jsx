import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    FileOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

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

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error: {error.message}</h2>;
    }

    return (
        <div>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className='demo-logo-vertical' />
                    <Menu
                        theme='dark'
                        mode='inline'
                        defaultSelectedKeys={['1']}
                        items={[
                            {
                                key: '1',
                                icon: <UserOutlined />,
                                label: 'Home',
                            },
                            {
                                key: '2',
                                icon: <FileOutlined />,
                                label: 'Files',
                            },
                            {
                                key: '3',
                                icon: <UploadOutlined />,
                                label: 'Upload',
                            },
                        ]}
                    />
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
