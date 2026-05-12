import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Productos from './pages/Productos';
import PublicarProducto from './pages/PublicarProducto';
import DetalleProducto from './pages/DetalleProducto';
import Perfil from './pages/Perfil';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/publicar" element={<PublicarProducto />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;