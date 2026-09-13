import '../css/detallecliente.css'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// COMMIT: "fix: unificar el rol de sesion y quitar el alert() del login"
// (antes: este import no existia, el rol se leia con localStorage.getItem("role"))
import useAutorizaciones from "../hooks/useAutorizaciones";
// COMMIT: "refactor: centralizar llamadas HTTP en clientesService"
// (antes: este import no existia, se usaba fetch directo a la API)
import clientesService from "../services/clientesService";

const DetalleCliente = () => {
 const { id } = useParams();
  const navigate = useNavigate();
  // COMMIT: "fix: unificar el rol de sesion y quitar el alert() del login"
  // (antes: const role = localStorage.getItem("role"))
  const { admin } = useAutorizaciones();
  const role = admin?.sector;

  const [cliente, setCliente] = useState(null);
  // COMMIT: "fix: manejar errores de carga en DetalleCliente"
  // (antes: este estado no existia)
  const [errorCarga, setErrorCarga] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // El useEffect de abajo paso por 3 commits distintos:
  // COMMIT: "fix: manejar errores de carga en DetalleCliente"
  // (antes: fetch(...).then(res => res.json()).then(data => setCliente(data)),
  // sin chequear res.ok ni tener .catch())
  // COMMIT: "fix: cancelar peticiones fetch al desmontar o cambiar de cliente"
  // (antes: no habia AbortController ni return () => controller.abort())
  // COMMIT: "refactor: centralizar llamadas HTTP en clientesService"
  // (antes: fetch(`https://fakestoreapi.com/users/${id}`, { signal }) directo;
  // ahora usa clientesService.obtenerClientePorId, por eso el catch chequea
  // "CanceledError" (axios) en vez de "AbortError" (fetch))
  useEffect(() => {
    const controller = new AbortController();

    clientesService
      .obtenerClientePorId(id, controller.signal)
      .then((data) => setCliente(data))
      .catch((err) => {
        if (err.name === "CanceledError") return;
        setErrorCarga(true);
      });

    return () => controller.abort();
  }, [id]);

  // COMMIT: "refactor: centralizar llamadas HTTP en clientesService"
  // (antes hacia un fetch DELETE directo a la API)
  const eliminarCliente = async () => {
    try {
      await clientesService.eliminarCliente(id);

      setMensaje("Cliente eliminado correctamente");

      setTimeout(() => {
        navigate("/clientes");
      }, 2000);
    } catch {
      // COMMIT: "fix: corregir los 4 errores de ESLint del proyecto"
      // (antes: catch (error) { ... } con 'error' sin usar)
      setMensaje("Error al eliminar cliente");
    }
  };
  if (errorCarga) {
    return <h2>No se pudo cargar la información del cliente.</h2>;
  }

  if (!cliente) {
    return <h2>Cargando cliente...</h2>;
  }

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>
      <p>Rol actual: {role}</p>

      {mensaje && <p className = 'mensaje-eliminado'>{mensaje}</p>}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      <p>
        <strong>Nombre:</strong>{" "}
        {cliente.name.firstname} {cliente.name.lastname}
      </p>

      <p>
        <strong>Email:</strong> {cliente.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {cliente.phone}
      </p>

      <h2>Dirección</h2>

      <p>
        <strong>Calle:</strong> {cliente.address.street}
      </p>

      <p>
        <strong>Número:</strong> {cliente.address.number}
      </p>

      <p>
        <strong>Código Postal:</strong> {cliente.address.zipcode}
      </p>

      <p>
        <strong>Ciudad:</strong> {cliente.address.city}
      </p>

      {/* COMMIT: "fix: quitar la contraseña del cliente visible en la ficha" */}
      {/* (titulo cambiado de "Credenciales" a "Cuenta") */}
      <h2>Cuenta</h2>

      <p>
        <strong>Usuario:</strong> {cliente.username}
      </p>
      {/* COMMIT: "fix: quitar la contraseña del cliente visible en la ficha" */}
      {/* (aca antes habia un <p><strong>Contraseña:</strong> {cliente.password}</p>, eliminado) */}

      {role?.trim() === "Gerencia" && (
        <button className='btn-eliminar'onClick={eliminarCliente}>
          Eliminar Cliente
        </button>
      )}
    </div>
  );
};

export default DetalleCliente;