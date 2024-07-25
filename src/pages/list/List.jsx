import React, { useState, useEffect } from "react";
import './List.scss';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";

const List = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar user={user} />
                <Datatable />
            </div>
        </div>
    );
};

export default List;
