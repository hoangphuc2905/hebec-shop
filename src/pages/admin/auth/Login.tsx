import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginAdmin } from "../../../api/adminApi";
import logo from "../../../assets/logo.png";

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const response = await loginAdmin({
        namespace: values.namespace,
        username: values.username,
        password: values.password,
      });

      if (response && response.status) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminNamespace", values.namespace);

        message.success("Đăng nhập thành công!");
        navigate("/admin");
      } else {
        message.error(response?.message || "Đăng nhập thất bại!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      message.error(
        error?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Card className="admin-login-card">
        <div className="admin-login-logo">
          <img src={logo} alt="Hebec Shop Admin" />
        </div>

        <Form
          name="admin_login"
          className="admin-login-form"
          initialValues={{ remember: true, namespace: "hoangphuc" }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="namespace"
            label={<span className="required-label">Namespace</span>}
            rules={[{ required: true, message: "Vui lòng nhập namespace!" }]}
          >
            <Input placeholder="Nhập namespace" size="large" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Admin username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Admin password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="admin-login-button"
              loading={loading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
