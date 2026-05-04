import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    cargarProducto();
  }, []);

  const cargarProducto = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/' + id);
      setProducto(res.data);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  if (cargando) return <div style={styles.cargando}>Cargando producto...</div>;
  if (!producto) return <div style={styles.cargando}>Producto no encontrado</div>;

  return (
    <div style={styles.container}>
      <button style={styles.btnVolver} onClick={() => navigate('/productos')}>
        Volver a productos
      </button>
      <div style={styles.card}>
        <div style={styles.imagenBox}>
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.titulo} style={styles.imagen} />
          ) : (
            <div style={styles.imagenPlaceholder}>📦</div>
          )}
        </div>
        <div style={styles.info}>
          <span style={styles.categoria}>{producto.categoria}</span>
          <h1 style={styles.titulo}>{producto.titulo}</h1>
          <p style={styles.precio}>Bs. {producto.precio}</p>
          <p style={styles.descripcion}>{producto.descripcion}</p>
          <p style={styles.ciudad}>📍 {producto.ciudad}</p>
          <div style={styles.vendedorBox}>
            <h3 style={styles.vendedorTitulo}>Información del vendedor</h3>
            <p style={styles.vendedorNombre}>
              👤 {producto.vendedor ? producto.vendedor.nombre : ''}
            </p>
            {producto.vendedor && producto.vendedor.email && (
              <p style={styles.contacto}>✉️ {producto.vendedor.email}</p>
            )}
            {producto.vendedor && producto.vendedor.telefono && (
              <p style={styles.contacto}>📞 {producto.vendedor.telefono}</p>
            )}
            {producto.vendedor && producto.vendedor.calificacionPromedio > 0 && (
              <p style={styles.calificacion}>
                ⭐ Calificación: {producto.vendedor.calificacionPromedio} / 5
              </p>
            )}
          </div>
          {producto.vendedor && producto.vendedor.email && (
            <a href={'mailto:' + producto.vendedor.email} style={styles.btnContactar}>
              Contactar al vendedor
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#f8f9fa', minHeight: '90vh' },
  cargando: { textAlign: 'center', padding: '80px', fontSize: '20px', color: '#7f8c8d' },
  btnVolver: { marginBottom: '20px', padding: '10px 20px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  card: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', maxWidth: '900px', margin: '0 auto' },
  imagenBox: { backgroundColor: '#ecf0f1' },
  imagen: { width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' },
  imagenPlaceholder: { fontSize: '100px', textAlign: 'center', padding: '80px' },
  info: { padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' },
  categoria: { backgroundColor: '#3498db', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', alignSelf: 'flex-start' },
  titulo: { color: '#2c3e50', fontSize: '28px', margin: '0' },
  precio: { color: '#27ae60', fontSize: '32px', fontWeight: 'bold', margin: '0' },
  descripcion: { color: '#7f8c8d', fontSize: '16px', lineHeight: '1.6' },
  ciudad: { color: '#95a5a6', fontSize: '14px' },
  vendedorBox: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' },
  vendedorTitulo: { color: '#2c3e50', fontSize: '16px', marginBottom: '10px' },
  vendedorNombre: { color: '#2c3e50', fontWeight: 'bold', fontSize: '15px', margin: '5px 0' },
  contacto: { color: '#7f8c8d', fontSize: '14px', margin: '5px 0' },
  calificacion: { color: '#f39c12', fontSize: '14px', margin: '5px 0' },
  btnContactar: { padding: '12px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }
};

export default DetalleProducto;