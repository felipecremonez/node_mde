import React, { useEffect, useState } from 'react';
import api from './api';
import InvoiceTable from './components/InvoiceTable';

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  async function login() {
    const username = prompt('Usuário', 'admin');
    const password = prompt('Senha', 'admin123');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Login falhou');
      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      alert('Logado com sucesso');
    } catch (err) {
      console.error(err);
      alert('Erro no login');
    }
  }

  async function fetchNotes() {
    setLoading(true);
    try {
      const res = await api.get('/nfe', { headers: { Authorization: 'Bearer ' + token } });
      setInvoices(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar notas: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(chave) {
    try {
      const res = await api.get(`/xml/${chave}`, { headers: { Authorization: 'Bearer ' + token }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chave}.xml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) { console.error(err); alert('Erro ao baixar XML'); }
  }

  async function handleManifest(chave) {
    try {
      const res = await api.post(`/manifesto/${chave}`, { tipo: 'CIENCIA' }, { headers: { Authorization: 'Bearer ' + token } });
      alert('Manifesto enviado: ' + JSON.stringify(res.data));
      fetchNotes();
    } catch (err) { console.error(err); alert('Erro ao manifestar'); }
  }

  return (
    <div className="container">
      <header>
        <h1>Painel de NF-e</h1>
        {!token ? <button className="btn" onClick={login}>Login</button> : <button className="btn" onClick={() => { localStorage.removeItem('token'); setToken(''); }}>Logout</button>}
      </header>
      {loading ? <p>Carregando...</p> : (token ? <InvoiceTable invoices={invoices} onDownload={handleDownload} onManifest={handleManifest} /> : <p>Faça login para ver as NF-e</p>)}
    </div>
  );
}
