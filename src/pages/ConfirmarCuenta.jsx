import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";

export default function ConfirmarCuenta() {

  const {token} = useParams();

  const [alerta, setAlerta] = useState({});
  const [confirmado, setConfirmado] = useState(false)
  
  useEffect( () => {
    const confirmarCuenta = async () => {
      try {
        const {data} = await clienteAxios(`/usuarios/confirmar/${token}`);
        setAlerta({msg: data.msg, error: false})
        setConfirmado(true);
      } catch (error) {
        setAlerta({msg: error.response.data.msg, error: true})
      }
    }

    confirmarCuenta();
  }, [])

  const {msg} = alerta

  return (
    <>
      <h1 className=" text-sky-600 font-black text-5xl capitalize">Confirma tu cuenta y comienza a crear tus <span className=" text-slate-700">proyectos</span></h1>

      <div className=" mt-10 md:mt-5 shadow-sm py-10 px-5 rounded-lg bg-white">
        {msg && <Alerta 
          alerta={alerta}
        />}

        {confirmado && (
        <Link to="/" className="block text-center text-sm text-slate-700 font-bold uppercase">
          Inicia sesión
        </Link>)}
      </div>
    </>
  )
}
