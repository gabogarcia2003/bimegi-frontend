import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [productos, setProductos] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

 // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [perfilRes, productosRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/perfil', {
          headers: { Authorization: 'Bearer ' + token }
        }),
        axios.get('http://localhost:5000/api/products')
      ]);
      setPerfil(perfilRes.data);
      const misProductos = productosRes.data.filter(
        p => p.vendedor && p.vendedor._id === usuario.id
      );
      setProductos(misProductos);
      const calRes = await axios.get(
        'http://localhost:5000/api/ratings/' + perfilRes.data._id
      );
      setCalificaciones(calRes.data);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await axios.delete('http://localhost:5000/api/products/' + id, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setProductos(productos.filter(p => p._id !== id));
    } catch (error) {
      alert('Error al eliminar producto');
    }
  };

  if (cargando) return <div style={styles.cargando}>Cargando perfil...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {perfil && perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : '?'}
        </div>
        <div style={styles.headerInfo}>
          <h1 style={styles.nombre}>{perfil && perfil.nombre}</h1>
          <p style={styles.email}>✉️ {perfil && perfil.email}</p>
          {perfil && perfil.telefono && (
            <p style={styles.telefono}>📞 {perfil.telefono}</p>
          )}
          <span style={styles.rol}>{perfil && perfil.rol}</span>
          {perfil && perfil.calificacionPromedio > 0 && (
            <p style={styles.calificacion}>
              ⭐ {perfil.calificacionPromedio} / 5 ({perfil.totalCalificaciones} reseñas)
            </p>
          )}
        </div>
      </div>

      <div style={styles.seccion}>
        <h2 style={styles.seccionTitulo}>Mis Productos ({productos.length})</h2>
        {productos.length === 0 ? (
          <p style={styles.vacio}>No tienes productos publicados aún</p>
        ) : (
          <div style={styles.grid}>
            {productos.map(p => (
              <div key={p._id} style={styles.card}>
                {p.imagen ? (
                  <img src={p.imagen} alt={p.titulo} style={styles.cardImagen} />
                ) : (
                  <div style={styles.cardPlaceholder}>📦</div>
                )}
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitulo}>{p.titulo}</h3>
                  <p style={styles.cardPrecio}>Bs. {p.precio}</p>
                  <div style={styles.cardBotones}>
                    <button
                      style={styles.btnVer}
                      onClick={() => navigate('/productos/' + p._id)}
                    >
                      Ver
                    </button>
                    <button
                      style={styles.btnEliminar}
                      onClick={() => eliminarProducto(p._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.seccion}>
        <h2 style={styles.seccionTitulo}>Calificaciones recibidas ({calificaciones.length})</h2>
        {calificaciones.length === 0 ? (
          <p style={styles.vacio}>No tienes calificaciones aún</p>
        ) : (
          calificaciones.map(c => (
            <div key={c._id} style={styles.calCard}>
              <div style={styles.calHeader}>
                <span style={styles.calNombre}>
                  👤 {c.calificador && c.calificador.nombre}
                </span>
                <span style={styles.calEstrellas}>
                  {'⭐'.repeat(c.puntuacion)}
                </span>
              </div>
              {c.comentario && (
                <p style={styles.calComentario}>{c.comentario}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#f8f9fa', minHeight: '90vh' },
  cargando: { textAlign: 'center', padding: '80px', fontSize: '20px', color: '#7f8c8d' },
  header: { display: 'flex', gap: '30px', backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px', alignItems: 'center' },
  avatar: { width: '80px', height: '80px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', flexShrink: 0 },
  headerInfo: { display: 'flex', flexDirection: 'column', gap: '8px' },
  nombre: { color: '#2c3e50', fontSize: '28px', margin: '0' },
  email: { color: '#7f8c8d', fontSize: '15px', margin: '0' },
  telefono: { color: '#7f8c8d', fontSize: '15px', margin: '0' },
  rol: { backgroundColor: '#3498db', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', alignSelf: 'flex-start' },
  calificacion: { color: '#f39c12', fontSize: '15px', margin: '0' },
  seccion: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '25px' },
  seccionTitulo: { color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' },
  vacio: { color: '#7f8c8d', textAlign: 'center', padding: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' },
  card: { border: '1px solid #ecf0f1', borderRadius: '8px', overflow: 'hidden' },
  cardImagen: { width: '100%', height: '130px', objectFit: 'cover' },
  cardPlaceholder: { fontSize: '40px', textAlign: 'center', padding: '20px', backgroundColor: '#ecf0f1' },
  cardBody: { padding: '12px' },
  cardTitulo: { color: '#2c3e50', fontSize: '14px', margin: '0 0 6px' },
  cardPrecio: { color: '#27ae60', fontWeight: 'bold', margin: '0 0 10px' },
  cardBotones: { display: 'flex', gap: '8px' },
  btnVer: { flex: 1, padding: '6px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnEliminar: { flex: 1, padding: '6px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  calCard: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
  calHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  calNombre: { color: '#2c3e50', fontWeight: 'bold' },
  calEstrellas: { fontSize: '16px' },
  calComentario: { color: '#7f8c8d', margin: '0', fontSize: '14px' }
};

export default Perfil;