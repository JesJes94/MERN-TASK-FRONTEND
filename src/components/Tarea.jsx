import formatearFecha from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyecto";
import useAdmin from "../hooks/useAdmin";

export default function Tarea({tarea}) {

    const {handleModalEditarTarea, handleModalEliminarTarea, completarTarea} = useProyectos();
    const admin = useAdmin();

    const {descripcion, nombre, prioridad, fechaEntrega, estado, _id} = tarea;

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-2 text-lg font-bold">{nombre}</p>
        <p className="mb-2 text-sm text-gray-500 uppercase">{descripcion}</p>
        <p className="mb-2 text-sm">{formatearFecha(fechaEntrega)}</p>
        <p className="mb-2 text-sm text-gray-600">Prioridad: {prioridad}</p>
        {estado && <p className="text-xs bg-green-600 uppercase font-bold p-2 rounded-lg text-white">Completada por: {tarea.completado.nombre}</p>}
      </div>

      <div className="flex flex-col gap-2">

        {admin && 
        
            <button
                className="bg-indigo-600 px-5 py-2 text-white uppercase font-bold text-sm rounded-md "
                onClick={() => handleModalEditarTarea(tarea)}
            >
                Editar
            </button>
        
        }
        
        <button
            className={`${estado ? 'bg-sky-600' : 'bg-gray-600'}  px-5 py-2 text-white uppercase font-bold text-sm rounded-md`}
            onClick={() => completarTarea(_id)}
            disabled = {estado && !admin ? true : false}
        >
            {estado ? 'Completa' : 'Incompleta'}
        </button>

        {admin &&

            <button
                className="bg-red-600 px-5 py-2 text-white uppercase font-bold text-sm rounded-md "
                onClick={() => handleModalEliminarTarea(tarea)}
            >
                Eliminar
            </button>

        }
      </div>
    </div>
  )
}
