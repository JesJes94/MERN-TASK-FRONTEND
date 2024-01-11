import { Link } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta";
import axios from "axios";
import clienteAxios from "../config/clienteAxios";

export default function Registrar() {

  const [registro, setRegistro] = useState({
    nombre: '',
    email: '',
    password: '',
    repetirPassword: ''
  });

  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    if(Object.values(registro).includes('')) {
      setAlerta({msg: 'Todos los campos son obligatorios', error: true})
      return
    }

    if(registro.password !== registro.repetirPassword) {
      setAlerta({msg: 'Los passwords no son iguales', error: true})
      return
    }

    if(registro.password.length < 6) {
      setAlerta({msg: 'El password es muy corto, agrega minimo 6 carácteres', error:true})
      return
    }

    try {
      const {repetirPassword, ...datos} = registro;
      const {data} = await clienteAxios.post('/usuarios',datos);
      setAlerta({msg: data.msg, error: false})
      setRegistro({
        nombre: '',
        email: '',
        password: '',
        repetirPassword: ''
      })
    } catch (error) {
      setAlerta({msg: error.response.data.msg, error: true});
    } 
  }

  const {msg} = alerta;

  return (
    <>

      <h1 className=" text-sky-600 font-black text-5xl capitalize">Crea tu cuenta y administra tus <span className=" text-slate-700">proyectos</span></h1>

      {msg && <Alerta 
        alerta={alerta}
      />}

      <form action="POST" className=" my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
      >

        <div className=" my-5 ">
            <label htmlFor="nombre" className=" uppercase text-gray-600 font-bold block text-xl">
              Nombre:
            </label>
            <input type="text" id="nombre" placeholder="Email de Registro aquí"
              className=" w-full p-3 my-3 border rounded-xl bg-gray-50"
              value={registro.nombre}
              onChange={e => setRegistro({...registro, nombre: e.target.value})}
            />
        </div>

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

        <div className=" my-5 ">
            <label htmlFor="password2" className=" uppercase text-gray-600 font-bold block text-xl">
              Repetir Password:
            </label>
            <input type="password" id="password2" placeholder="Password aquí"
              className=" w-full p-3 my-3 border rounded-xl bg-gray-50"
              value={registro.repetirPassword}
              onChange={e => setRegistro({...registro, repetirPassword: e.target.value})}
            />
        </div>
        
        <input type="submit" value="Crea tu cuenta"
          className=" bg-sky-600 w-full py-3 px-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        >

        </input>
      </form>

      <nav className="lg:flex lg:justify-between">
      <Link to="/" 
        className="block text-center my-5 text-slate-600 font-bold text-sm uppercase">
          ¿Ya tienes una cuenta?, inicia sesión
      </Link>
      <Link to="/olvide-password" 
        className="block text-center my-5 text-slate-600 font-bold text-sm uppercase">
          Olvide mi password
      </Link>
      </nav>
    </>
  )
}
