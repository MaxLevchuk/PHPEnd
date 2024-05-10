import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import http_common from "../../../http_common.ts";
import { Link } from "react-router-dom";
import { IProductItem } from "./IProductItem.ts";

const ProductsListPage: React.FC = () => {
    const [list, setList] = useState<IProductItem[]>([]);

    const columns: ColumnsType<IProductItem> = [
        { title: "#", dataIndex: "id" },
        { title: "Name", dataIndex: "name" },
        { title: "Price", dataIndex: "price" },
        { title: "Description", dataIndex: "description" },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Category", dataIndex: "category" },
        {
            render: (item: IProductItem) => (
                <Link to={`show/${item.id}`}>
                    <Button type="primary" style={{ margin: "13px" }}>View</Button>
                </Link>
            )
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http_common.get("/api/products");
                const productList: IProductItem[] = response.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    quantity: item.quantity,
                    category: item.category.name
                }));
                setList(productList);
            } catch (error) {
                console.error("Error fetching product list:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="list">
            <h1>Product List</h1>
            <Table columns={columns} rowKey="id" dataSource={list} size="middle" />
        </div>
    );
};

export default ProductsListPage;
