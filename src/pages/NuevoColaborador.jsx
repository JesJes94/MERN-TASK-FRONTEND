import {useEffect} from 'react'
import { useParams, useLocation } from 'react-router-dom'
import FormularioColaborador from '../components/FormularioColaborador'
import useProyectos from '../hooks/useProyecto'
import Spinner from '../components/Spinner';
import Alerta from '../components/Alerta';

export default function NuevoColaborador() {

  const {id} = useParams();

  const location = useLocation();
  localStorage.setItem('lastpath', location.pathname);

  const {proyecto, obtenerProyecto, cargandoColaborador, colaborador, agregarColaborador, alerta} = useProyectos();

  useEffect( () => {
    obtenerProyecto(id);
  }, [])

  if(!proyecto?._id) return <Alerta alerta={alerta} />

  return (
    <>
      <h1 className='text-3xl font-black'>Añadir Colaborador(a) al Proyecto: {proyecto?.nombre}</h1>

      <div className='mt-10 flex justify-center'>
        <FormularioColaborador />
      </div>

      {cargandoColaborador ? 
        <div className='mt-10 flex justify-center'>
          <Spinner /> 
        </div>
        
      : colaborador?._id && (
        <div className='flex justify-center mt-10'>
          <div className='bg-white shadow md:w-3/4 rounded-lg px-5 py-10 w-full'>
            <h2 className='mb-10 text-center text-2xl font-bold'>Resultado:</h2>

            <div className='flex justify-between items-center'>
              <p>{colaborador.nombre}</p>

              <button
                className='bg-slate-500 hover:bg-slate-600 py-2 px-5 rounded-lg uppercase text-white font-bold text-sm transition-colors'
                onClick={() => agregarColaborador({email: colaborador.email})}
              >
                Agregar al Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
