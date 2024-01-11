import { useState, useEffect, createContext} from "react";
import { useNavigate} from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client"

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([]);
    const [proyecto, setProyecto] = useState(JSON.parse(localStorage.getItem('proyecto')) ?? {});
    const [colaborador, setColaborador] = useState({});
    const [tarea, setTarea] = useState({});
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);
    const [cargandoColaborador, setCargandoColaborador] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [buscador, setBuscador] = useState(false);
    
    const {autenticado} = useAuth();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const mostrarAlerta = alerta => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({})
        }, 3000);
    }

    const handleModalTarea = () => {
        setTarea({})
        setModalFormularioTarea(!modalFormularioTarea);
    }

    useEffect( () => {
        
        const obtenerProyectos = async () => {

            if(!token) return;

            try {
                const {data} = await clienteAxios('/proyectos', config);
                setProyectos(data);   
                setAlerta({});         
            } catch (error) {
                console.log(error);
            }
        }

        obtenerProyectos();

    }, [autenticado])

    useEffect( () => {
        socket = io(import.meta.env.VITE_BACKEND_URL.split('/api')[0]);
    }, [])

    const obtenerProyecto = async id => {
        setCargando(true);

        if(!token) return

        try {
            const {data} = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data);
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg:error.response.data.msg, error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false);
        }
    }

    const submitProyecto = async proyecto => {

        if(!token) {
            return
        }

        try {
            const {data} = await clienteAxios.post('/proyectos', proyecto, config);
            setProyectos([...proyectos, data])
            setAlerta({
                msg:'Proyecto creado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error)
        }
    }

    const editarProyecto = async (proyecto) => {
        if(!token) return

        try {
            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);
            
            //Sincronizar el state

            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState);

            setProyectos(proyectosActualizados);

            setAlerta({ msg: 'Proyecto Actualizado Correctamente', error: false})

            setTimeout(() => {
                setAlerta({}),
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error)
        }  
    }

    const eliminarProyecto = async id => {
        try {
            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config);

            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id);
            setProyectos(proyectosActualizados);

            setAlerta({msg: data.msg, error: false});

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos');
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const submitTarea = async tarea => {
        try {
            const {data} = await clienteAxios.post(`/tareas`, tarea, config);

            setAlerta({});
            setModalFormularioTarea(false);

            //Socket IO

            socket.emit('nueva tarea', data);

        } catch (error) {
            console.log(error)
        }
    }

    const editarTarea = async tarea => {
        try {
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config);

            socket.emit('editar tarea', data);

            setAlerta({});
            setModalFormularioTarea(false);
        } catch (error) {
            console.log(error);
        }
    }

    
    const eliminarTarea = async () => {
        try {
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config);
            
            setAlerta({ msg: data.msg, error: false});
            setModalEliminarTarea(false);

            socket.emit('eliminar tarea', tarea)

            setTarea({});

            setTimeout(() => {
                setAlerta({});
            }, 3000);

        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async email => {

        setCargandoColaborador(true);

        try {
            const {data} = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config)
            setColaborador(data);
            setAlerta({});
        } catch (error) {
            setAlerta({msg: error.response.data.msg, error:true})
        } finally {
            setCargandoColaborador(false);
        }
    }

    const agregarColaborador = async email => {
        try {
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
            setAlerta({
                msg: data.msg, 
                error: false
            })
            setColaborador(false)

            setTimeout(() => {
                setAlerta({});
                navigate(`/proyectos/${proyecto._id}`);
            }, 3000);

        } catch (error) {
            setAlerta({
                msg:error.response.data.msg, 
                error: true
            })
        }
    }

    const eliminarColaborador = async () => {
        try {
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

            const proyectoActualizado = {...proyecto};

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(
                colaboradorState => colaboradorState._id !== colaborador._id
            )

            setAlerta({
                msg:data.msg,
                error:false
            })

            setColaborador({});
            setProyecto(proyectoActualizado)
            setModalEliminarColaborador(false);

            setTimeout(() => {
               setAlerta({}) 
            }, 3000);
            
        } catch (error) {
            console.log(error);
        }
    }

    const completarTarea = async id => {
        try {
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);

            socket.emit('cambiar estado', data);

            setTarea({});
            setAlerta({});

        } catch (error) {
            console.log(error.response);
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    }

    const handleModalEliminarColaborador = colaborador => {
        setColaborador(colaborador)
        setModalEliminarColaborador(!modalEliminarColaborador);
    }

    const handleBuscador = () => {
        setBuscador(!buscador);
    }

    //Socket IO

    const submitTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
        setProyecto(proyectoActualizado);
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => 
            tareaState._id !== tarea._id    
        )
        setProyecto(proyectoActualizado);
    }

    const editarTareaProyecto = tarea => {

        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
            tareaState._id === tarea._id ? tarea : tareaState         
        )

        setProyecto(proyectoActualizado);
    }

    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                alerta,
                mostrarAlerta,
                submitProyecto,
                editarProyecto,
                obtenerProyecto,
                eliminarProyecto, 
                proyecto,
                cargando,
                cargandoColaborador,
                tarea,
                modalFormularioTarea,
                modalEliminarTarea,
                handleModalTarea,
                submitTarea,
                editarTarea,
                completarTarea,
                handleModalEditarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                colaborador,
                submitColaborador,
                agregarColaborador,
                eliminarColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                buscador,
                handleBuscador,
                submitTareaProyecto,
                eliminarTareaProyecto,
                editarTareaProyecto,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext;