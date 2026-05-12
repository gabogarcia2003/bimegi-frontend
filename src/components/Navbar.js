import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛒 Bimegi</Link>
      <div style={styles.links}>
        <Link to="/productos" style={styles.link}>Productos</Link>
        {usuario ? (
          <>
            <Link to="/publicar" style={styles.link}>+ Publicar</Link>
            <Link to="/perfil" style={styles.link}>Mi Perfil</Link>
            {usuario.rol === 'admin' && (
              <Link to="/admin" style={styles.linkAdmin}>Panel Admin</Link>
            )}
            <span style={styles.bienvenida}>Hola, {usuario.nombre}</span>
            <button onClick={cerrarSesion} style={styles.btn}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Iniciar sesión</Link>
            <Link to="/registro" style={styles.link}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white' },
  logo: { color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: 'white', textDecoration: 'none', fontSize: '16px' },
  linkAdmin: { color: '#f39c12', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' },
  bienvenida: { color: '#3498db', fontSize: '16px' },
  btn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Navbar;