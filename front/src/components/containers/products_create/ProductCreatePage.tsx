import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, Alert, Modal, Select, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { IProductCreate } from "./IProductCreate.ts";
import http_common from "../../../http_common.ts";

const { Option } = Select;

const ProductCreatePage = () => {
    const navigate = useNavigate();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [source, setSource] = useState<{ value: number; label: string }[]>([]);
    const [category, setCategory] = useState<number>(0);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleCancel = () => setPreviewOpen(false);

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onFinish = async (values: any) => {
        let imgs: File[] = [];
        fileList.forEach((element) => {
            imgs.push(element.originFileObj as File);
        });
        const model: IProductCreate = {
            name: values.name,
            price: values.price,
            description: values.description,
            quantity: values.quantity,
            category_id: category,
            images: imgs
        };
        try {
            await http_common.post("/api/product", model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).catch(ex1 => console.log(ex1));

            navigate("/");
        } catch (ex) {
            message.error('Error creating product!');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const takeCateg = async () => {
        await http_common.get("/api/categories")
            .then(resp => {
                if (source.length === 0) {
                    const options = resp.data.map(element => ({ value: element.id, label: element.name }));
                    setSource(options);
                }
            });
    };

    useEffect(() => {
        takeCateg();
    }, []);

    const takeCategory = (value: number) => setCategory(value);

    return (
        <>
            <Divider>Add Product</Divider>
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
                    rules={[{ required: true, message: 'Specify product name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Specify price!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Specify description!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Discount"
                    name="quantity"
                    rules={[{ required: true, message: 'Specify quantity!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Category"
                    rules={[{ required: true, message: 'Select category!' }]}
                >
                    <Select
                        placeholder="Category"
                        onChange={takeCategory}
                    >
                        {source.map(option => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Upload
                    beforeUpload={() => false}
                    listType="picture-card"
                    fileList={fileList}
                    multiple
                    onPreview={handlePreview}
                    onChange={handleChange}
                    accept="image/*"
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Add
                    </Button>
                    <Button type="primary" htmlType="button" style={{ background: "black", color: "white", marginLeft: 30 }} onClick={() => { navigate(-1) }}>
                        Go Back
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProductCreatePage;
