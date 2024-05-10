import { Button, Divider, Form, Input, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import http_common from "../../../http_common.ts";
import { ILogin } from "./types..ts";
import { AuthContext } from "../../../contexts/AuthContext.tsx";

const LoginPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { UserLogin } = useContext(AuthContext);

    const onFinish = async (values: ILogin) => {
        try {
            const user: ILogin = {
                email: values.email,
                password: values.password
            };

            const response = await http_common.post("/api/login", user);
            localStorage.setItem('authToken', response.data.token);
            UserLogin();
            navigate("/");
        } catch (error) {
            console.error('Error during login:', error);
            message.error('Error during login!');
            setErrorMessage("Error during login");
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    return (
        <>
            <Divider style={customDividerStyle}>Login</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                name="basic"
                style={{ maxWidth: "100%" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    htmlFor="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { min: 2, message: 'Email must be at least 2 characters!' }
                    ]}
                >
                    <Input autoComplete="email" id={"email"} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    htmlFor={"password"}
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' },
                    ]}
                    hasFeedback
                >
                    <Input.Password id={"password"} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <Button type="primary" htmlType="button" style={{ background: "black", color: "white", marginLeft: 30 }} onClick={() => { navigate(-1) }}>
                        Go Back
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default LoginPage;
