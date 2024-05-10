import {Route, Routes} from "react-router-dom";
import Container_Default from "./components/containers/default/Container_Default.tsx";
import NoMatch from "./components/pages/NoMatch.tsx";
import ListPage from "./components/containers/list/ListPage.tsx";
import CategoryCreatePage from "./components/containers/create/CategoryCreatePage.tsx";
import EditPage from "./components/containers/edit/edit.tsx";
import RegisterPage from "./components/containers/register/RegisterPage.tsx";
import LoginPage from "./components/containers/login/LoginPage.tsx";
import React from "react";
import LeavePage from "./components/containers/leave/LeavePage.tsx";
import ProductsListPage from "./components/containers/products/ProductsListPage.tsx";
import ShowPage from "./components/containers/show/ShowPage.tsx";
import ProductCreatePage from "./components/containers/products_create/ProductCreatePage.tsx";




const App: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Container_Default/>}>
                    <Route index element={<ListPage/>}/>
                    <Route path={'create'} element={<CategoryCreatePage/>}></Route>
                    <Route path={'edit/:id'} element={<EditPage/>}></Route>
                    <Route path={'register'} element={<RegisterPage/>}/>
                    <Route path={'login'} element={<LoginPage/>}/>
                    <Route path={'leave'} element={<LeavePage/>}/>
                    <Route path={'products'} element={<ProductsListPage/>}/>
                    <Route path={'products/show/:id'} element={<ShowPage/>}/>
                    <Route path={'product/create'} element={<ProductCreatePage/>}/>


                    <Route path="*" element={<NoMatch/>}/>
                </Route>
            </Routes>
        </>
    );
};

export default App;