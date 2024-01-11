import { useState } from "react"
import useProyectos from "../hooks/useProyecto";
import Alerta from "./Alerta";

export default function FormularioColaborador() {

    const {mostrarAlerta, alerta, submitColaborador} = useProyectos();

    const [email, setEmail] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        if(email === '') {
            mostrarAlerta({msg: 'El email es obligatorio', error:true})
            return
        }

        submitColaborador(email);
    }

    const {msg} = alerta;

  return (
    <div className="md:w-3/4 w-full">

        {msg && <Alerta 
            alerta={alerta}
        />}

        <form 
            className='bg-white px-5 py-10 shadow'
            onSubmit={handleSubmit}
        >
        <div className=' mb-5'>
            <label 
                htmlFor="email"
                className='text-gray-700 uppercase font-bold text-sm'  
            >
                    Email Usuario
            </label>

            <input 
                type="email" 
                id='email'
                placeholder='Email del Usuario'
                className=' border w-full p-2 mt-2 placeholder-gray-400 rounded-lg'
                value={email}
                onChange={e => setEmail(e.target.value)}
            />    
        </div>

        <input 
                type="submit"
                value={'Buscar Colaborador'}
                className=" bg-sky-600 w-full p-3 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-sky-700 transition-colors"
            />
        </form>
    </div>
  )
}
