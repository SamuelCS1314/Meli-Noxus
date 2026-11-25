import { Outlet } from "react-router-dom" 
import Sidebar from "./Sidebar"
import Header from "./Header"

export default function Layout(){
    return (    
        <div className="d-flex flex-column vh-100">
            <Header />
            
            <div className="d-flex flex-grow-1 overflow-auto"> 
                <Sidebar />

                <main className="flex-grow-1 p-4 overflow-auto bg-light">
                    <Outlet />
                
                </main>
            </div>
        </div>
    )
}