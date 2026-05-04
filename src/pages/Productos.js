import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async (filtro = '') => {
    try {
      const url = filtro
        ? `http://localhost:5000/api/products?buscar=${filtro}`
        : 'http://localhost:5000/api/products';
      const res = await axios.get(url);
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Productos disponibles</h2>
      <div style={styles.buscador}>
        <input
          style={styles.input}
          placeholder="Buscar producto..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <button style={styles.btn} onClick={() => cargarProductos(buscar)}>Buscar</button>
        <Link to="/publicar" style={styles.btnPublicar}>+ Publicar producto</Link>
      </div>
      <div style={styles.grid}>
        {productos.length === 0 ? (
          <p style={styles.vacio}>No hay productos disponibles</p>
        ) : (
          productos.map((p) => (
            <div key={p._id} style={styles.card}>
              {p.imagen ? (
                <img src={p.imagen} alt={p.titulo} style={styles.imagen} />
              ) : (
                <div style={styles.imagenPlaceholder}>📦</div>
              )}
              <div style={styles.cardBody}>
                <span style={styles.categoria}>{p.categoria}</span>
                <h3 style={styles.cardTitulo}>{p.titulo}</h3>
                <p style={styles.descripcion}>{p.descripcion}</p>
                <p style={styles.precio}>Bs. {p.precio}</p>
                <div style={styles.vendedorBox}>
                  <p style={styles.vendedorNombre}>👤 {p.vendedor?.nombre}</p>
                  {p.vendedor?.email && (
                    <p style={styles.contacto}>✉️ {p.vendedor.email}</p>
                  )}
                  {p.vendedor?.telefono && (
                    <p style={styles.contacto}>📞 {p.vendedor.telefono}</p>
                  )}
                  {p.vendedor?.calificacionPromedio > 0 && (
                    <p style={styles.calificacion}>⭐ {p.vendedor.calificacionPromedio}</p>
                  )}
                </div>
                <p style={styles.ciudad}>📍 {p.ciudad}</p>
                <button
                  style={styles.btnVer}
                  onClick={() => window.location.href = `/productos/${p._id}`}
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#f8f9fa', minHeight: '90vh' },
  titulo: { textAlign: 'center', color: '#2c3e50', fontSize: '32px', marginBottom: '20px' },
  buscador: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' },
  input: { padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', width: '300px' },
  btn: { padding: '10px 20px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  btnPublicar: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' },
  imagen: { width: '100%', height: '200px', objectFit: 'cover' },
  imagenPlaceholder: { fontSize: '60px', textAlign: 'center', padding: '30px', backgroundColor: '#ecf0f1' },
  cardBody: { padding: '20px' },
  categoria: { backgroundColor: '#3498db', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  cardTitulo: { color: '#2c3e50', fontSize: '18px', margin: '10px 0 8px' },
  descripcion: { color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' },
  precio: { color: '#27ae60', fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' },
  vendedorBox: { borderTop: '1px solid #ecf0f1', paddingTop: '10px', marginBottom: '8px' },
  vendedorNombre: { color: '#2c3e50', fontWeight: 'bold', fontSize: '14px', margin: '4px 0' },
  contacto: { color: '#7f8c8d', fontSize: '13px', margin: '4px 0' },
  calificacion: { color: '#f39c12', fontSize: '14px', margin: '4px 0' },
  ciudad: { color: '#95a5a6', fontSize: '13px' },
  btnVer: { padding: '10px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginTop: '10px', width: '100%' },
  vacio: { textAlign: 'center', color: '#7f8c8d', fontSize: '18px', gridColumn: '1/-1' }
};

export default Productos;