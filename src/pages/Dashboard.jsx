import '../css/dashboard.css'
import useAutorizaciones from '../hooks/useAutorizaciones'

const Dashboard = () => {
  const { admin } = useAutorizaciones()

  return (
    <div className="dashboard">

      <h1>Panel de Control de Clientes</h1>

      {/* COMMIT: "fix: quitar codigo muerto del Dashboard" */}
      {/* (antes: import Login + {!admin ? <Login/> : <>...esto...</>}, la rama
          !admin nunca se ejecutaba porque RutaProtegida ya redirige antes) */}
      <div className="user-card">
        <h3>Usuario conectado</h3>

        <p><strong>Administrador:</strong> {admin.nombre}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Sector:</strong> {admin.sector}</p>
      </div>
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Clientes</h3>
          <p>10</p>
        </div>

        <div className="dashboard-card">
          <h3>Gerencia</h3>
          <p>3</p>
        </div>

        <div className="dashboard-card">
          <h3>Soporte</h3>
          <p>3</p>
        </div>
      </div>

    </div>
  )
}

export default Dashboard