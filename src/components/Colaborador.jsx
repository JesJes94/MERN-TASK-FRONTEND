import React from 'react'
import useProyectos from '../hooks/useProyecto';


export default function Colaborador({colaborador}) {

    const {nombre, email} = colaborador;

    const {handleModalEliminarColaborador} = useProyectos();

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div>
        <p className='mb-2'>{nombre}</p>
        <p className='text-sm text-gray-400'>{email}</p>
      </div>

      <div>
        <button
            type='button'
            className='bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white 
            uppercase font-bold py-2 px-5 text-sm'
            onClick={() => handleModalEliminarColaborador(colaborador)}
        >
            Eliminar
        </button>
      </div>
    </div>
  )
}
