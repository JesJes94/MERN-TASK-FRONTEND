import { useState } from "react"
import { useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyecto";
import Alerta from "./Alerta";

export default function FormularioProyecto({proyecto = {}}) {

    const {id} = useParams();

    const {alerta, mostrarAlerta, submitProyecto, editarProyecto} = useProyectos();

    const [registro, setRegistro] = useState(JSON.parse(localStorage.getItem('crear-proyecto')) ?? {
        nombre: proyecto?.nombre || '',
        descripcion: proyecto?.descripcion || '',
        fechaEntrega: proyecto.fechaEntrega?.slice(0, 10)  || '',
        cliente: proyecto?.cliente || ''
    })

    const handleSubmit = async e => {
        e.preventDefault();

        if(Object.values(registro).includes('')) {
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        localStorage.setItem('crear-proyecto', JSON.stringify(registro));

        if(!id) {
            await submitProyecto(registro);
        } else {
            await editarProyecto({...registro, id});
        }

        setRegistro({
            nombre: '',
            descripcion: '',
            fechaEntrega: '',
            cliente: ''
        })

        localStorage.removeItem('crear-proyecto');
    }

    const {msg} = alerta

  return (
    <div className="md:w-3/4">

        {msg && <Alerta 
            alerta={alerta}
        />}

        <form className=' bg-white py-10 px-5 rounded-lg shadow'
            onSubmit={handleSubmit}
        >

        <div className="mb-5">
            <label 
                htmlFor="nombre"
                className=' text-gray-700 uppercase font-bold text-sm'
                >
                Nombre Proyecto
            </label>

            <input 
                id='nombre'
                type="text" 
                className=' border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                placeholder='Nombre del Proyecto'
                value={registro.nombre}
                onChange={ e => setRegistro({...registro, nombre: e.target.value})}
            />
        </div>

        <div className="mb-5">
            <label 
                htmlFor="descripcion"
                className=' text-gray-700 uppercase font-bold text-sm'
                >
                Descripción
            </label>

            <textarea 
                id='descripcion'
                className=' border w-full p-2 mt-2 h-40 placeholder-gray-400 rounded-md'
                placeholder='Descripción del Proyecto'
                value={registro.descripcion}
                onChange={ e => setRegistro({...registro, descripcion: e.target.value})}
            />
        </div>

        <div className="mb-5">
            <label 
                htmlFor="fecha-entrega"
                className=' text-gray-700 uppercase font-bold text-sm'
                >
                Fecha Entrega
            </label>

            <input 
                id='fecha-entrega'
                type="date" 
                className=' border w-full p-2 placeholder-gray-400 rounded-md'
                value={registro.fechaEntrega}
                onChange={ e => setRegistro({...registro, fechaEntrega: e.target.value})}
            />
        </div>

        <div className="mb-5">
            <label 
                htmlFor="cliente"
                className=' text-gray-700 uppercase font-bold text-sm'
                >
                Cliente
            </label>

            <input 
                id='cliente'
                type="text" 
                className=' border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                placeholder='Nombre del Cliente'
                value={registro.cliente}
                onChange={ e => setRegistro({...registro, cliente: e.target.value})}
            />
        </div>

        <input 
            type="submit"
            value={!id ? 'Crear Proyecto' : 'Actualizar Proyecto'}
            className=" bg-sky-600 w-full p-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-700 transition-colors"
        />
        </form>
    </div>
  )
}
