import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      </div>
      <div style={styles.grid}>
        {productos.length === 0 ? (
          <p style={styles.vacio}>No hay productos disponibles</p>
        ) : (
          productos.map((p) => (
            <div key={p._id} style={styles.card}>
              <div style={styles.imagen}>📦</div>
              <h3 style={styles.cardTitulo}>{p.titulo}</h3>
              <p style={styles.descripcion}>{p.descripcion}</p>
              <p style={styles.precio}>Bs. {p.precio}</p>
              <p style={styles.vendedor}>Vendedor: {p.vendedor?.nombre}</p>
              <span style={styles.categoria}>{p.categoria}</span>
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
  buscador: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' },
  input: { padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', width: '300px' },
  btn: { padding: '10px 20px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  imagen: { fontSize: '60px', textAlign: 'center', marginBottom: '10px' },
  cardTitulo: { color: '#2c3e50', fontSize: '18px', marginBottom: '8px' },
  descripcion: { color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' },
  precio: { color: '#27ae60', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' },
  vendedor: { color: '#7f8c8d', fontSize: '13px', marginBottom: '8px' },
  categoria: { backgroundColor: '#3498db', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  vacio: { textAlign: 'center', color: '#7f8c8d', fontSize: '18px', gridColumn: '1/-1' }
};

export default Productos;