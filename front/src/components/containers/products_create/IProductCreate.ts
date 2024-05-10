import {UploadFile} from "antd";

export interface IProductCreate{
    name:string;
    price:number;
    description:string;
    quantity:number;
    category_id:number;
    images:File[];
}