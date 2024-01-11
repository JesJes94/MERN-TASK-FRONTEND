import {Link} from "react-router-dom"
import useAuth from "../hooks/useAuth"
export default function Proyecto({proyecto}) {

    const {nombre, cliente, creador, _id} = proyecto;

    const {autenticado} = useAuth();


  return (
    <div className=" border-b p-5 flex justify-between items-center">
       
        <div className=" block">
          <p>
              {nombre}
          </p>

          <p className="mt-3 text-sm text-gray-500 uppercase">{''} {cliente}</p>
        </div>

        {
          autenticado._id !== creador && (
            <p className="p-2 bg-green-500 rounded-md text-white text-xs uppercase font-bold">
              Colaborador
            </p>
          ) 
        }
      
        <Link 
            to={`${_id}`}
            className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
        >Ver Proyecto</Link>
    </div>
  )
}
