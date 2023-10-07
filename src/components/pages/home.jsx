import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    FileOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Upload, message, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const { Header, Sider, Content } = Layout;

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [user] = useAuthState(auth);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Logging out...');
        auth.signOut();
        navigate('/');
    };

    const handleFileUpload = (file) => {
        if (file.name) {
            message.success(`${file.name} has been uploaded`);
        } else {
            message.success('File has been uploaded');
        }
    };


    const [uploadedFiles] = useState([]);

    const handleFileView = (file) => {
        message.info(`${file.name} view file`);
    };

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
                            <Upload
                                showUploadList={false}
                                customRequest={handleFileUpload}
                            >
                                <Button>Upload</Button>
                            </Upload>
                        </Menu.Item>
                        <Menu.Item
                            key='4'
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
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
                        {user ? (
                            <h1 className='home-title'>Hello {email ? email : 'none'}</h1>
                        ) : null}
                        <List
                            header={<div>Uploaded Files</div>}
                            bordered
                            dataSource={uploadedFiles}
                            renderItem={(file) => (
                                <List.Item
                                    key={file.name}
                                    onClick={() => handleFileView(file)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {file.name}
                                </List.Item>
                            )}
                        />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default Home;
