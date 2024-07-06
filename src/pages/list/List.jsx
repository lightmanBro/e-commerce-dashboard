import React from "react";
import './List.scss'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import {useAuth} from "../../context/AuthContext"
import Datatable from "../../components/datatable/Datatable";
const List = ()=>{
    const {user} = useAuth()
    return (
        <div className="list">
            <Sidebar/>
            <div className="listContainer">
            <Navbar user={user}/>
                <Datatable/>
            </div>
        </div>
    )
}

export default List