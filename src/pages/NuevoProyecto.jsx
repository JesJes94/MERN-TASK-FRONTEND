import { useLocation } from 'react-router-dom';
import FormularioProyecto from '../components/FormularioProyecto'

export default function NuevoProyecto() {

  const location = useLocation();
  localStorage.setItem('lastpath', location.pathname);

  return (
    <>
      <h1 className=' text-3xl font-bold'>Crear Proyecto</h1>

      <div className=' mt-10 flex justify-center'>
        <FormularioProyecto />
      </div>
    </>
  )
}