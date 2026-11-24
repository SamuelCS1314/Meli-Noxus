import { Outlet } from "react-router-dom" 
import Sidebar from "./Sidebar"
import Header from "./Header"

export default function Layout(){
    return (    
        <div className="">
            <Header />

            <div>
                <Sidebar />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>

    )
}