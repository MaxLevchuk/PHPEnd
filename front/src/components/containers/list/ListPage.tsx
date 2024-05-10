import React, {useEffect, useState} from "react";
import {ICategoryItem} from "./type.ts";
import {Button, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import http_common from "../../../http_common.ts";
import {APP_ENV} from "../../../env";
import {Link} from "react-router-dom";
import "./style.css";

const ListPage:React.FC=()=>{
    const[list,setList]=useState<ICategoryItem[]>([

    ]);
    const imagePath=`${APP_ENV.BASE_URL}/upload/150_`;
    const columns:ColumnsType<ICategoryItem>=[
        {
            title:"#",
            dataIndex:"id"
        },

        {
            title:"Назва",
            dataIndex: "name",
        },
        {
            title:"Ціна",
            dataIndex: "price",
        },
        {
            title:"Фото",
            dataIndex: "image",
            render:(imageName:string)=>{
                return(<img src={`${imagePath}${imageName}`} alt="Фото" width={100}/> );
            }
        },
        {
            render:(item:ICategoryItem )=>(<><Link to={`edit/${item.id}`}><Button type="primary" style={{margin:"13px"}}>Edit</Button></Link>
                <Button onClick={()=>deleteCategory(item.id)} type="primary" style={{margin:"13px"}} danger>Delete</Button></>)
        }

    ]
    const showPage = ()=>{
        http_common.get<ICategoryItem[]>("/api/categories")
            .then(resp=>{setList(resp.data)})
    }
    const deleteCategory = (index:number)=>{
        http_common.get(`api/categories/delete/${index}`).then(()=>showPage());
    }


    useEffect(()=>{
        showPage();
    },[]);

    return (
        <div className="list">
            <h1>Список категорій</h1>
            {/* Use the Link component from react-router-dom */}
            <Link to="/create">
                {/* Use the Button component from antd */}
                <Button type="primary" style={{margin:"13px"}}>
                    Додати категорію
                </Button>
            </Link>
            <Table columns={columns} rowKey={"id"} dataSource={list} size={"middle"}/>
        </div>
    )
}
export default ListPage;