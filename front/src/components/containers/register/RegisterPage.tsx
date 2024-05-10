import React, { useState } from "react";
import { Button, Divider, Form, Input, message, Alert, Modal, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { IRegister, IRegisterForm } from "./types.ts";
import http_common from "../../../http_common.ts";
import { RcFile } from "antd/es/upload/interface";
import { imageConverter } from "../../../interfaces/forms";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [file, setFile] = useState<UploadFile | null>();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onFinish = async (values: IRegisterForm) => {
        const user: IRegister = {
            ...values,
            image: values.image?.thumbUrl
        };
        try {
            await http_common.post("/api/register", user, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/");
        } catch (ex) {
            console.error(ex);
            message.error('Error registering!');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFile }: { fileList: UploadFile[] }) => {
        const newFileList = newFile.slice(-1);
        setFile(newFileList[0]);
    };

    return (
        <>
            <Divider style={customDividerStyle}>Registration</Divider>
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
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Specify name!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Surname"
                    name="surname"
                    rules={[{ required: true, message: 'Specify surname!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    htmlFor="email"
                    rules={[{ required: true, message: 'Specify email!' },
                    { type: 'email', message: "Invalid email format!" },
                    { min: 2, message: 'Email must be at least 2 characters long!' }]}
                >
                    <Input autoComplete="email" id={"email"} />
                </Form.Item>
                <Form.Item
                    label="Phone Number"
                    name="phone"
                    htmlFor="phone"
                    rules={[{ required: true, message: 'Specify phone number!' }, { min: 11, message: 'Phone number must contain at least 11 characters!' }]}
                >
                    <Input autoComplete="phone" id={"phone"} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    htmlFor={"password"}
                    rules={[
                        { required: true, message: 'Specify your password!', },
                        { min: 6, message: 'Password must be at least 6 characters long!', },
                    ]}
                    hasFeedback
                >
                    <Input.Password id={"password"} />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="password_confirmation"
                    htmlFor={"password_confirmation"}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password id={"password_confirmation"} />
                </Form.Item>
                <Form.Item
                    label="Photo"
                    name="image"
                    getValueFromEvent={imageConverter}
                >
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture-card"
                        onChange={handleChange}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        {file ? null :
                            (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Choose Photo</div>
                                </div>)
                        }
                    </Upload>
                </Form.Item>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt={"Selected Photo"} style={{ width: "100%" }} src={previewImage} />
                </Modal>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <Button type="primary" htmlType="button" style={{ background: "black", color: "white", marginLeft: 30 }} onClick={() => { navigate(-1) }}>
                        Go Back
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default RegisterPage;
