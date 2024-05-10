import { Button, Divider, Form, Input, Upload, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ICategoryCreate } from "./types.ts";
import http_common from "../../../http_common.ts";

const CategoryCreatePage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onFinish = async (values: any) => {
        if (!file) {
            setErrorMessage("Please choose a photo!");
            return;
        }

        const model: ICategoryCreate = {
            name: values.name,
            price: values.price,
            image: file,
        };

        try {
            await http_common.post("/api/categories/create", model, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            navigate("/");
        } catch (error) {
            message.error('Error creating category!');
        }
    }

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setFile(file);
            setErrorMessage("");
        } else if (info.file.status === 'error') {
            message.error('File upload failed!');
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Please select an image file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('File size should not exceed 10MB!');
        }
        return isImage && isLt2M;
    };

    return (
        <>
            <Divider>Add Category</Divider>
            {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />}
            <Form
                name="basic"
                style={{maxWidth: "100%"}}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please specify category name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please specify price!' }]}
                >
                    <Input />
                </Form.Item>

                <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    accept={"image/*"}
                >
                    {file ? <img src={URL.createObjectURL(file)} alt="avatar" style={{width: '100%'}}/> : (
                        <div>
                            <LoadingOutlined />
                            <div style={{marginTop: 8}}>Upload</div>
                        </div>
                    )}
                </Upload>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Add
                    </Button>
                    <Button type="primary" htmlType="button" style={{background:"black",color:"white",marginLeft:30}} onClick={() => {navigate(-1)}}>
                        Go Back
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryCreatePage;
