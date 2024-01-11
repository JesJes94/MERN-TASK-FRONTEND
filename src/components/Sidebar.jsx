import {Link} from "react-router-dom"
import useAuth from "../hooks/useAuth"

export default function Sidebar() {

  const {autenticado} = useAuth();

  return (
    <aside className=' md:w-80 lg:w-96 px-5 py-10'>
      <p className=' text-xl font-bold'> Hola: {autenticado.nombre}</p>

      <Link 
        to="crear-proyecto"
        className=" bg-sky-600 w-full p-3 text-white uppercase font-bold block mt-5 text-center rounded-md"
      >Nuevo proyecto</Link>  
    </aside>
  )
}
