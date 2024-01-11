import useProyectos from '../hooks/useProyecto'
import Alerta from '../components/Alerta';
import { useLocation } from 'react-router-dom';
import PreviewProyecto from '../components/PreviewProyecto';

export default function Proyectos() {

  const {proyectos, alerta} = useProyectos();

  const {msg} = alerta

  const location = useLocation();
  localStorage.setItem('lastpath', location.pathname);

  return (
    <>
      <h1 className=' text-3xl font-bold'>Proyectos</h1>

      {msg && <Alerta alerta={alerta}/>}

      <div className='mt-5 bg-white shadow rounded-lg'>
        {proyectos?.length ? 
          proyectos.map(proyecto => (
          <PreviewProyecto 
            key={proyecto._id}
            proyecto={proyecto}
          />
          ))
         : <p className=' text-center font-bold text-gray-600 uppercase p-5'>No hay proyectos aún</p>}
      </div>
    </>
  )
}
