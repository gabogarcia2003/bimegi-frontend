import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // eslint-disable-next-line
  useEffect(() => {
    if (!token || !usuario || usuario.rol !== 'admin') {
      navigate('/');
      return;
    }
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setUsuarios(res.data);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await axios.put('http://localhost:5000/api/users/' + id + '/rol',
        { rol: nuevoRol },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setUsuarios(usuarios.map(u =>
        u._id === id ? { ...u, rol: nuevoRol } : u
      ));
      setMensaje('Rol actualizado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      setMensaje('Error al cambiar rol');
    }
  };

  const desactivarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar este usuario?')) return;
    try {
      await axios.put('http://localhost:5000/api/users/' + id + '/desactivar',
        {},
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setUsuarios(usuarios.map(u =>
        u._id === id ? { ...u, activo: false } : u
      ));
      setMensaje('Usuario desactivado');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      setMensaje('Error al desactivar usuario');
    }
  };

  if (cargando) return <div style={styles.cargando}>Cargando panel...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Panel de Administrador</h1>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>{usuarios.length}</h3>
          <p style={styles.statLabel}>Total usuarios</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>
            {usuarios.filter(u => u.rol === 'vendedor').length}
          </h3>
          <p style={styles.statLabel}>Vendedores</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>
            {usuarios.filter(u => u.rol === 'comprador').length}
          </h3>
          <p style={styles.statLabel}>Compradores</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>
            {usuarios.filter(u => u.activo).length}
          </h3>
          <p style={styles.statLabel}>Activos</p>
        </div>
      </div>

      <div style={styles.tabla}>
        <h2 style={styles.tablaTitulo}>Gestión de Usuarios</h2>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Rol</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Calificación</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u._id} style={u.activo ? styles.tr : styles.trInactivo}>
                <td style={styles.td}>{u.nombre}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <select
                    style={styles.select}
                    value={u.rol}
                    onChange={(e) => cambiarRol(u._id, e.target.value)}
                    disabled={u.rol === 'admin'}
                  >
                    <option value="comprador">Comprador</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <span style={u.activo ? styles.activo : styles.inactivo}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={styles.td}>
                  {u.calificacionPromedio > 0 ? '⭐ ' + u.calificacionPromedio : '-'}
                </td>
                <td style={styles.td}>
                  {u.activo && u.rol !== 'admin' && (
                    <button
                      style={styles.btnDesactivar}
                      onClick={() => desactivarUsuario(u._id)}
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#f8f9fa', minHeight: '90vh' },
  cargando: { textAlign: 'center', padding: '80px', fontSize: '20px', color: '#7f8c8d' },
  titulo: { color: '#2c3e50', fontSize: '32px', marginBottom: '20px' },
  mensaje: { backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', borderRadius: '6px', marginBottom: '20px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
  statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' },
  statNum: { color: '#2c3e50', fontSize: '36px', margin: '0' },
  statLabel: { color: '#7f8c8d', margin: '5px 0 0' },
  tabla: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  tablaTitulo: { color: '#2c3e50', fontSize: '22px', marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { backgroundColor: '#2c3e50' },
  th: { padding: '12px 15px', color: 'white', textAlign: 'left', fontSize: '14px' },
  tr: { borderBottom: '1px solid #ecf0f1' },
  trInactivo: { borderBottom: '1px solid #ecf0f1', backgroundColor: '#ffeaea' },
  td: { padding: '12px 15px', color: '#2c3e50', fontSize: '14px' },
  select: { padding: '6px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px' },
  activo: { backgroundColor: '#27ae60', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  inactivo: { backgroundColor: '#e74c3c', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  btnDesactivar: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }
};

export default Admin;