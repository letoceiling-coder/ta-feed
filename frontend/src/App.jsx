import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Главная</Link>
        <Link to="/about">О проекте</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Добро пожаловать в LiveGrid</h1>
      <p>Это React приложение интегрированное с Laravel</p>
      <p>React Router работает! Попробуйте перейти на страницу "О проекте"</p>
    </div>
  );
}

function About() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>О проекте</h1>
      <p>Информация о проекте LiveGrid</p>
      <p>Вы успешно перешли на страницу "О проекте" через React Router!</p>
    </div>
  );
}

export default App;
