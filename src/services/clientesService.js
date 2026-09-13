import axios from "axios";

// COMMIT: "chore: mover la URL de la API a una variable de entorno"
// (antes: const URL = "https://fakestoreapi.com/users";)
const URL = `${import.meta.env.VITE_API_URL}/users`;

// COMMIT: "refactor: centralizar llamadas HTTP en clientesService"
// (obtenerClientes es nueva, antes ListaClientes hacia el fetch directo)
const obtenerClientes = async (signal) => {

    const respuesta = await axios.get(
        URL,
        { signal }
    );

    return respuesta.data;
};

// COMMIT: "refactor: centralizar llamadas HTTP en clientesService"
// (obtenerClientePorId es nueva, antes DetalleCliente hacia el fetch directo)
const obtenerClientePorId = async (id, signal) => {

    const respuesta = await axios.get(
        `${URL}/${id}`,
        { signal }
    );

    return respuesta.data;
};

const crearCliente = async (cliente) => {

    const respuesta = await axios.post(
        URL,
        cliente
    );

    return respuesta.data;
};

// COMMIT: "refactor: centralizar llamadas HTTP en clientesService"
// (eliminarCliente es nueva, antes DetalleCliente hacia el fetch DELETE directo)
const eliminarCliente = async (id) => {

    const respuesta = await axios.delete(
        `${URL}/${id}`
    );

    return respuesta.data;
};

// COMMIT: "refactor: centralizar llamadas HTTP en clientesService"
// (antes: export default { crearCliente }; se agregan los 3 metodos nuevos)
export default {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    eliminarCliente
};
