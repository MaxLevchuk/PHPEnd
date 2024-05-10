
import {useNavigate, useParams} from "react-router-dom";

import {ICategoryEdit} from "./types.ts";
import http_common from "../../../http_common.ts";
import {Alert, Button, Divider, Form, Input, message, Upload} from "antd";
import type {RcFile, UploadFile, UploadProps} from "antd/es/upload/interface";
import type {UploadChangeParam} from "antd/es/upload";
import {APP_ENV} from "../../../env";
import {useEffect, useState} from "react";

const EditPage = ()=>{
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [model,setModel]=useState({id:-1,name:"",price:0,image:null});
    const {id}=useParams();

    useEffect(() => {
        const showProps = async ()=>{
            const res = await http_common.get(`/api/categories/get_by_id/${id}`);
            setModel(res.data);
        }
        showProps();
    }, [id]);
    const onFinish = async (values: any) => {

        const modelEdit : ICategoryEdit = {
            name: values.name,
            price:values.price,
            image: file!,

        };
        try {
            await http_common.post(`/api/categories/edit/${id}`, modelEdit,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/");
        }
        catch (ex) {
            message.error('Error category create');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setFile(file);
            setErrorMessage("");
        }
    };
    const imagePath=`${APP_ENV.BASE_URL}/upload/150_`;
    const uploadButton = (
        <div>
            <img src={`${imagePath}${model.image}`} alt="Photo" width={95}/>
        </div>
    );

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('error: File size >10MB');
        }
        return isImage && isLt2M;
    };

    return (
        <>
            {model.name.length>0?<>
                    <Divider style={customDividerStyle}>{`Refresh category № ${model.id}`}</Divider>
                    {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />}
                    <Form
                        name="basic"
                        style={{maxWidth: "100%"}}
                        initialValues={{name:model.name,price:model.price}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"

                    >
                        <Form.Item<FieldType>
                            label="Name"
                            name="name"


                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Price" name="price">
                            <Input/>

                        </Form.Item>

                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            accept={"image/*"}
                        >
                            {file ? <img src={URL.createObjectURL(file)} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>

                        <Form.Item wrapperCol={{offset: 8, span: 16}} >
                            <Button type="primary" htmlType="submit">
                                Оновити
                            </Button>
                            <Button type="primary" htmlType="button" style={{background:"black",color:"white",marginLeft:30}} onClick={()=>{navigate(-1)}}>
                                Повернутися
                            </Button>
                        </Form.Item>
                    </Form>
                </>
                :""}
        </>
    );
}
export default  EditPage;