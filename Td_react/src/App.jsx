import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Notes from './components/Notes.jsx';
import Etudiants from './components/Etudiants.jsx';
import Matieres from './components/Matieres.jsx';
import APropos from './components/APropos.jsx';
import RandomItemDisplay from './RandomItemDisplay.jsx';

function Header() {
    return (
        <header>
            <img src="https://emsi.ma/wp-content/uploads/2020/07/logo-1.png" alt="Logo de votre formation" style={{ maxWidth: '100%', height: 'auto' }} />
            <h1>Introduction à React</h1>
            <h2>A la découverte des premières notions de React</h2>
        </header>
    );
}

function Navbar() {
    const menuItems = ['Notes', 'Etudiants', 'Matières', 'A propos'];
    return (
        <nav>
            <ul style={{ listStyleType: 'none', display: 'flex', gap: '20px' }}>
                {menuItems.map((item) => (
                    <li key={item}>
                        <Link to={`/${item.toLowerCase()}`} style={{ textDecoration: 'none', fontSize: '16px' }}>
                            {item}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function Footer({ Nom, Prenom }) {
    const currentYear = new Date().getFullYear();
    return (
        <footer style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>© {currentYear} - {Prenom}.{Nom}, Tous droits réservés.</p>
        </footer>
    );
}

function App() {
    const [search, setSearch] = useState('');

    return (
        <Router>
            <Navbar />
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<p>Sélectionnez une option dans le menu.</p>} />
                    <Route path="/notes" element={<Notes search={search} setSearch={setSearch} />} />
                    <Route path="/etudiants" element={<Etudiants search={search} setSearch={setSearch} />} />
                    <Route path="/matières" element={<Matieres search={search} setSearch={setSearch} />} />
                    <Route path="/a propos" element={<APropos />} />
                    <Route path="/random" element={<RandomItemDisplay />} />
                </Routes>
                <Footer Nom="Rzama" Prenom="Hamza" />
            </div>
        </Router>
    );
}

export default App;
