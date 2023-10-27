import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import {
  UploadOutlined,
} from "@ant-design/icons";
import { Layout, Button, theme, message, List } from "antd";
import { Link } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "../styles/home.css";

const { Content } = Layout;

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [user] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile || !selectedFile.name) {
        throw new Error("Invalid file or file name is missing.");
      }

      const storage = getStorage();
      const storageRef = ref(storage, `uploads/${selectedFile.name}`);

      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);

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
        <Layout>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {user ? (
              <div>
                <div className="box">
                  <div>
                    <input type="file" onChange={handleFileChange} className="home-file-upload-input" />
                    <Button icon={<UploadOutlined />} className="home-upload-button" onClick={handleFileUpload}>
                      Upload File
                    </Button>
                  </div>
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
                      <Link
                        to={file.downloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.name}
                      </Link>
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



