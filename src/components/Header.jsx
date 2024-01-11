import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import useProyectos from "../hooks/useProyecto";
import useAuth from "../hooks/useAuth";
import Busqueda from "./Busqueda";

export default function Header() {

  const {handleBuscador, cerrarSesionProyectos} = useProyectos();
  const {cerrarSesionAuth} = useAuth();

  const navigate = useNavigate();

  const cerrarSesion = () => {

    const alert = confirm('¿Deseas cerrar la sesión actual?')

    if(alert) {
      cerrarSesionProyectos();
      cerrarSesionAuth()

      let removerItems = ['token', 'lastpath', 'proyecto']

      removerItems.forEach(item => {
        localStorage.removeItem(item);
      })
      navigate('/')
    }

  }

  return (
    <header className=' px-4 py-5 bg-white border-b'>
      <div className=' md:flex md:justify-between md:items-center'>
        <h2 className=' text-4xl text-sky-600 font-black text-center'>UpTask</h2>

        <div className=" flex justify-center items-center gap-4 mt-5 md:mt-0">
            <button
              type="button"
              className=" font-bold uppercase"
              onClick={handleBuscador}
            >
              Buscar Proyecto
            </button>

            <Link to="/proyectos"
                className=" font-bold uppercase"
            > Proyectos
            </Link>

            <button
                type="button"
                className=" text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold"
                onClick={cerrarSesion}
            >
                Cerrar Sesión
            </button>

            <Busqueda />
        </div>
      </div>
    </header>
  )
}
