import { useContext } from "react";

import ProyectosContext from "../context/proyectosProvider";

export default function useProyectos() {
    return useContext(ProyectosContext);
}