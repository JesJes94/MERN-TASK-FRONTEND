import { Outlet, Navigate } from "react-router-dom"
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useAuth from "../hooks/useAuth";

export default function RutaProtegida() {

    const {autenticado, cargando} = useAuth();

    if(cargando) return "Cargando..."

  return (
    <div>
        {autenticado._id ? (
            <div>
                <Header />

                <div className=" md:flex md:min-h-screen">
                    <Sidebar />
                    
                    <main className=" flex-1 p-10">
                        <Outlet />
                    </main>
                </div>
            </div>
        ) : <Navigate to = '/' />}
    </div>
  )
}
