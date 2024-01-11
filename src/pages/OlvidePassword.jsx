import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";

export default function OlvidePassword() {

  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    if(email === '' || email.length < 6) {
      setAlerta({msg: 'El email es obligatorio', error: true});
      return
    }

    try {
      const {data} = await clienteAxios.post('/usuarios/olvide-password', {email});
      setAlerta({msg: data.msg, error: false});
      setEmail('');

    } catch (error) {
      setAlerta({msg: error.response.data.msg, error: true})
    }
  }

  const {msg} = alerta;

  return (
    <>
      <h1 className=" text-sky-600 font-black text-5xl capitalize">Recupera tu password y no pierdas tus <span className=" text-slate-700">proyectos</span></h1>

      {msg && <Alerta 
       alerta={alerta}
      />}

      <form action="" className=" my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
      >
        
        <div className=" my-5 ">
          <label htmlFor="email" className=" uppercase text-gray-600 font-bold block text-xl">
            Email:
          </label>
          <input type="email" id="email" placeholder="Escribe tu email aquí"
            className=" w-full p-3 my-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        
        <input type="submit" value="Enviar instrucciones"
          className=" bg-sky-600 w-full py-3 px-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        >

        </input>
     </form>

     <nav className="lg:flex lg:justify-between">
      <Link to="/registrar" 
        className="block text-center my-5 text-slate-600 font-bold text-sm uppercase">
          ¿No tienes una cuenta?, registrate aquí
      </Link>
      <Link to="/" 
        className="block text-center my-5 text-slate-600 font-bold text-sm uppercase">
          Ya tienes una cuenta, inicia sesión
      </Link>
     </nav>
    </>
  )
}
