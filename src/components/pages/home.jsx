import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase"; // Import Firebase Authentication
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Upload, message, List } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL, // Import Firebase Storage methods
} from "firebase/storage";
import "../styles/home.css";

const { Header, Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    auth.signOut();
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile || !selectedFile.name) {
        throw new Error("Invalid file or file name is missing.");
      }

      const storage = getStorage(); // Initialize Firebase Storage
      const storageRef = ref(storage, `uploads/${selectedFile.name}`); // Reference to the storage location

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, selectedFile);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      // Store the download URL and file name
      setUploadedFiles((prevUploadedFiles) => [
        ...prevUploadedFiles,
        { name: selectedFile.name, downloadURL },
      ]);

      message.success(`${selectedFile.name} has been uploaded`);
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error(`File upload failed: ${error.message}`);
    }
  };

  const handleFileView = (file) => {
    window.open(file.downloadURL, "_blank");
  };

  return (
    <div>
      <Layout className="home">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            className="home-menu"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              Home
            </Menu.Item>

            <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
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
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {user ? (
              <div className="box">
                <h1 className="home-title">Hello {email ? email : "none"}</h1>
                <div>
                  <input type="file" onChange={handleFileChange} />
                  <Button icon={<UploadOutlined />} onClick={handleFileUpload}>
                    Upload File
                  </Button>
                </div>
                <List
                  header={<div>Uploaded Files</div>}
                  bordered
                  dataSource={uploadedFiles}
                  renderItem={(file) => (
                    <List.Item
                      key={file.name}
                      onClick={() => handleFileView(file)}
                      style={{ cursor: "pointer" }}
                    >
                      <a
                        href={file.downloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.name}
                      </a>
                    </List.Item>
                  )}
                />
              </div>
            ) : null}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;


