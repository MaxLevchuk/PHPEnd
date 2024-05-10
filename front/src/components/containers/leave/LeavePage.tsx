
import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";

import http_common from "../../../http_common.ts";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
const LeavePage = () => {

    const navigate = useNavigate();
    const {UserExit} = useContext(AuthContext);
    const exit=async()=>{await http_common('api/leave');}
    useEffect(()=>{
        exit();
        localStorage.setItem("",'authToken');
        UserExit();
        navigate(-1);
    },[])


    return (
        <>

        </>
    );
}

export default LeavePage;