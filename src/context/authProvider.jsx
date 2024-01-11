import {useState, useEffect, createContext} from "react"
import {useNavigate} from "react-router-dom"
import clienteAxios from "../config/clienteAxios"

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [autenticado, setAutenticado] = useState({});
    const [cargando, setCargando] = useState(true);
    const [submit, setSubmit] = useState(false);

    const path = localStorage.getItem('lastpath') || '/proyectos'
    const navigate = useNavigate();

    useEffect( () => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
        
            if(!token) {
                setCargando(false);
                return
            } 

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const {data} = await clienteAxios("/usuarios/perfil", config)
                setAutenticado(data);
                navigate(path);
            } catch (error) {
                setAutenticado({});
            } finally {
                setCargando(false)
            }
        }

        autenticarUsuario();
   
    }, [submit])

    const cerrarSesionAuth = () => {
        setAutenticado({})
    }

     return (
        <AuthContext.Provider
            value={{
                autenticado,
                setAutenticado,
                setSubmit,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
     )
}

export {
    AuthProvider
}

export default AuthContext;

