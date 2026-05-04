import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Bienvenido a Bimegi 🛒</h1>
      <p style={styles.subtitulo}>La plataforma de compra y venta más fácil de Bolivia</p>
      <div style={styles.botones}>
        <Link to="/productos" style={styles.btnPrimario}>Ver Productos</Link>
        <Link to="/publicar" style={styles.btnSecundario}>Publicar un producto</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', padding: '80px 20px', backgroundColor: '#f8f9fa', minHeight: '90vh' },
  titulo: { fontSize: '48px', color: '#2c3e50', marginBottom: '20px' },
  subtitulo: { fontSize: '20px', color: '#7f8c8d', marginBottom: '40px' },
  botones: { display: 'flex', justifyContent: 'center', gap: '20px' },
  btnPrimario: { padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '18px' },
  btnSecundario: { padding: '15px 30px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '18px' }
};

export default Home;