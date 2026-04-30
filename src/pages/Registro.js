import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'comprador' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/registro', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Crear Cuenta</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="text" name="nombre" placeholder="Nombre completo" onChange={handleChange} />
        <input style={styles.input} type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input style={styles.input} type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
        <select style={styles.input} name="rol" onChange={handleChange}>
          <option value="comprador">Comprador</option>
          <option value="vendedor">Vendedor</option>
        </select>
        <button style={styles.btn} onClick={handleSubmit}>Registrarse</button>
        <p style={styles.texto}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', backgroundColor: '#f8f9fa' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' },
  titulo: { textAlign: 'center', color: '#2c3e50', marginBottom: '10px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
  btn: { padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center' },
  texto: { textAlign: 'center', color: '#7f8c8d' }
};

export default Registro;