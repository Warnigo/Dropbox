import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import {
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Layout, Button, theme, message, List } from "antd";
import { Link } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "../styles/home.css";

const { Content } = Layout;

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // useEffect(() => {
  //   if (user) {
  //     setEmail(user.email);
  //   }
  // }, [user]);

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

  const handleFileDelete = async (file) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `uploads/${file.name}`);

      try {
        await getDownloadURL(storageRef);
      } catch (error) {
        throw new Error("File not found in Firebase Storage.");
      }

      await deleteObject(storageRef);

      setUploadedFiles((prevUploadedFiles) =>
        prevUploadedFiles.filter((uploadedFile) => uploadedFile.name !== file.name)
      );

      message.success(`${file.name} has been deleted`);
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error(`File deletion failed: ${error.message}`);
    }
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
                  <h1 className="home-title">Hello {email ? email : "none"}</h1>
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
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleFileDelete(file)}
                        style={{ color: "red" }}
                      />
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



