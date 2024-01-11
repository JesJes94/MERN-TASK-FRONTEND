import useProyectos from "./useProyecto"
import useAuth from "./useAuth"

export default function useAdmin() {

    const {proyecto} = useProyectos();
    const {autenticado} = useAuth();

    return proyecto.creador === autenticado._id
}

