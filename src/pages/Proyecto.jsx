import { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyecto';
import useAdmin from '../hooks/useAdmin';
import Spinner from '../components/Spinner';
import Tarea from '../components/Tarea';
import Colaborador from '../components/Colaborador';
import ModalFormularioTarea from '../components/ModalFormularioTarea';
import ModalEliminarTarea from '../components/ModalEliminarTarea';
import ModalEliminarColaborador from '../components/ModalEliminarColaborador';
import io from "socket.io-client"

let socket;

export default function Proyecto() {

    const {id} = useParams();
    const location = useLocation();
    localStorage.setItem('lastpath', location.pathname);

    const {
      obtenerProyecto, 
      proyecto, 
      cargando, 
      handleModalTarea,
      submitTareaProyecto,
      eliminarTareaProyecto,
      editarTareaProyecto
    } = useProyectos();

    const admin = useAdmin();

    useEffect( () => {
        obtenerProyecto(id);
    }, [])

    useEffect( () => {
      socket = io(import.meta.env.VITE_BACKEND_URL.split('/api')[0]);
      socket.emit('abrir proyecto', id);
    }, [])

    useEffect( () => {

      if(!proyecto.nombre || cargando) return;
      
      socket.on('tarea agregada', tareaNueva => {
          submitTareaProyecto(tareaNueva);
      })

      socket.on('tarea actualizada', tareaActualizada => {
        editarTareaProyecto(tareaActualizada);
      })

      socket.on('nuevo estado', nuevoEstadoTarea => {
        editarTareaProyecto(nuevoEstadoTarea);
      })

      socket.on('tarea eliminada', tareaEliminada => {
          eliminarTareaProyecto(tareaEliminada);
      })

      return () => {
        socket.off('tarea agregada');
        socket.off('tarea actualizada');
        socket.off('nuevo estado');
        socket.off('tarea eliminada');
      }
    })

    const {nombre} = proyecto;

  return ( 
      <>
        { cargando ? <Spinner /> : 
          (
          <>
            <div className='flex justify-between items-start'>
              <h1 className=' font-bold text-3xl'>{nombre}</h1>

              {admin &&
              
                <div className='flex gap-2 text-gray-400 hover:text-black'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>

                  
                    <Link to={`/proyectos/editar/${id}`}
                        className='uppercase font-bold'
                    >
                      Editar
                    </Link>
                </div>
              }

            </div>

            {admin && <button 
              onClick={handleModalTarea}
              type='button'
              className='mt-5 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center flex gap-2 items-center justify-center'  
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}   stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

              Nueva Tarea
            </button>}

            <p className=' text-xl font-bold mt-10'>Tareas del Proyecto</p>

            <div className='bg-white rounded-lg shadow mt-10'>
              {proyecto.tareas?.length ?  
                proyecto.tareas?.map(tarea => (
                  <Tarea 
                    key={tarea._id}
                    tarea={tarea}
                  />
                ))
                : 
              <p className=' text-center my-5 p-10'>No hay tareas en este proyecto.</p>}
            </div>

            {admin && 

              <>
                <div className='flex items-center justify-between mt-10'>
                  <p className=' text-xl font-bold'>Colaboradores</p>
                  <Link
                    to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                    className='text-gray-400 hover:text-black font-bold uppercase'
                  >
                    Añadir
                  </Link>
                </div>
              
                <div className='bg-white rounded-lg shadow mt-10'>
                  {proyecto.colaboradores?.length ?  
                    proyecto.colaboradores?.map(colaborador => (
                      <Colaborador
                        key={colaborador._id}
                        colaborador={colaborador}
                      />
                    ))
                    : 
                  <p className=' text-center my-5 p-10'>No hay colaboradores en este proyecto.</p>}
                </div>
              </>
            }

            <ModalFormularioTarea />
            <ModalEliminarTarea />
            <ModalEliminarColaborador />
        
          </>
          )
        }
      </>
    )
}
