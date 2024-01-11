import {useState} from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

export default function Login() {

  const [registro, setRegistro] = useState({
    email: '',
    password: ''
  });

  const [alerta, setAlerta] = useState({})  

  const {setSubmit} = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();

    if(Object.values(registro).includes('')) {
      setAlerta({msg: 'Todos los campos son obligatorios', error: true})
      return
    }

    try {
      const {data} = await clienteAxios.post('/usuarios/login', registro);
      setAlerta({});
      localStorage.setItem('token', data.token);
      setSubmit(true);

    } catch (error) {
      setAlerta({msg: error.response.data.msg, error: true})
    }
    
  }

  const {msg} = alerta;

  return (
    <>
     <h1 className=" text-sky-600 font-black text-5xl capitalize">Inicia sesión y administra tus <span className=" text-slate-700">proyectos</span></h1>

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
          <input type="email" id="email" placeholder="Email de Registro aquí"
            className=" w-full p-3 my-3 border rounded-xl bg-gray-50"
            value={registro.email}
            onChange={e => setRegistro({...registro, email: e.target.value})}
          />
        </div>
        
        <div className=" my-5 ">
          <label htmlFor="password" className=" uppercase text-gray-600 font-bold block text-xl">
            Password:
          </label>
          <input type="password" id="password" placeholder="Password aquí"
            className=" w-full p-3 my-3 border rounded-xl bg-gray-50"
            value={registro.password}
            onChange={e => setRegistro({...registro, password: e.target.value})}
          />
        </div>
        
        <input type="submit" value="Iniciar Sesion"
          className=" bg-sky-600 w-full py-3 px-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        >

        </input>
     </form>

     <nav className="lg:flex lg:justify-between">
      <Link to="registrar" 
        className="block text-center my-5 text-slate-600 font-bold text-sm uppercase">
          ¿No tienes una cuenta?, registrate aquí
      </Link>
      <Link to="olvide-password" 
        className="block text-center my-5 text-slate-600 font-bold text-sm uppercase">
          Olvide mi password
      </Link>
     </nav>
    </>
  )
}
