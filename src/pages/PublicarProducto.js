import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PublicarProducto() {
  const [form, setForm] = useState({
    titulo: '', descripcion: '', precio: '', categoria: 'otros', ciudad: 'La Paz'
  });
  const [imagen, setImagen] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMensaje('La imagen es muy grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const imagenComprimida = canvas.toDataURL('image/jpeg', 0.7);
          setImagen(imagenComprimida);
          setMensaje('');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post('http://localhost:5000/api/products',
        { ...form, imagen },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje('¡Producto publicado exitosamente!');
      setTimeout(() => navigate('/productos'), 2000);
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || 'Error al publicar');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Publicar Producto</h2>
        {mensaje && <p style={mensaje.includes('exitosamente') ? styles.exito : styles.error}>{mensaje}</p>}
        <input style={styles.input} type="text" name="titulo" placeholder="Título del producto" onChange={handleChange} />
        <textarea style={styles.textarea} name="descripcion" placeholder="Descripción del producto" onChange={handleChange} rows={4} />
        <input style={styles.input} type="number" name="precio" placeholder="Precio en Bs." onChange={handleChange} />
        <select style={styles.input} name="categoria" onChange={handleChange}>
          <option value="otros">Otros</option>
          <option value="electronica">Electrónica</option>
          <option value="ropa">Ropa</option>
          <option value="hogar">Hogar</option>
          <option value="deportes">Deportes</option>
          <option value="libros">Libros</option>
        </select>
        <input style={styles.input} type="text" name="ciudad" placeholder="Ciudad" onChange={handleChange} defaultValue="La Paz" />
        <div style={styles.imagenBox}>
          <label style={styles.labelImagen}>
            📷 Seleccionar imagen
            <input type="file" accept="image/*" onChange={handleImagen} style={{ display: 'none' }} />
          </label>
          {imagen && <img src={imagen} alt="preview" style={styles.preview} />}
        </div>
        <button style={styles.btn} onClick={handleSubmit}>Publicar Producto</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f8f9fa', minHeight: '90vh' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px' },
  titulo: { textAlign: 'center', color: '#2c3e50' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
  textarea: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', resize: 'vertical' },
  btn: { padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
  exito: { color: 'green', textAlign: 'center', fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', fontWeight: 'bold' },
  imagenBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  labelImagen: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  preview: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }
};

export default PublicarProducto;