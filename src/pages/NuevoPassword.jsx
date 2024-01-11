import {useState, useEffect} from "react"
import {useParams, Link} from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta"

export default function NuevoPassword() {

  const {token} = useParams();
  const [confirmado, setConfirmado] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [password, setPassword] = useState('');
  const [passwordModificado, setPasswordModificado] = useState(false);

  useEffect( () => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`);
        setConfirmado(true);
      } catch (error) {
        setAlerta({msg: error.response.data.msg, error: true});
      }
    }

    comprobarToken();

  }, [])

  const handleSubmit = async e => {
    e.preventDefault();

    if(password === '') {
      setAlerta({msg: 'El password es obligatorio', error: true})
      return
    }

    if(password.length < 6) {
      setAlerta({msg: 'El password es corto, introduzca más de 6 carácteres', error: true})
      return
    }

    try {
      const {data} = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password})
      setAlerta({msg: data.msg, error: false})
      setPassword('');
      setPasswordModificado(true);

    } catch (error) {
      console.log(error)
    }
  }

  const {msg} = alerta;

  return (
    <>
      <h1 className=" text-sky-600 font-black text-5xl capitalize">Reestablece tu password y no pierdas tus <span className=" text-slate-700">proyectos</span></h1>

      {confirmado ? (
          <>
            {msg && <Alerta 
              alerta={alerta}
            />}

            <form action="" className=" my-10 bg-white shadow rounded-lg p-10"
                  onSubmit={handleSubmit}
            >

            <div className=" my-5 ">
                <label htmlFor="password" className=" uppercase text-gray-600 font-bold block text-xl">
                  Nuevo Password:
                </label>
                <input type="password" id="password" placeholder="Password aquí"
                  className=" w-full p-3 my-3 border rounded-xl bg-gray-50"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
            </div>
            
            <input type="submit" value="Guardar Nuevo Password"
              className=" bg-sky-600 w-full py-3 px-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
            >

            </input>
          </form>

          {passwordModificado &&
            <Link to="/" className="block text-center text-sm text-slate-700 font-bold uppercase">
            Inicia sesión
            </Link>
          }
        </>
      ) : (
        <Alerta 
          alerta={alerta}
        />
    )}

    </>
  )
}
