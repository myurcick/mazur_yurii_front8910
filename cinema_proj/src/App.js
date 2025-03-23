// src/App.jsx
import React from 'react';
import MovieList from './components/MovieList';
import { movies } from './data/movies';
import './index.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Кінопоказ Тижня</h1>
      </header>
      <main>
        <MovieList movies={movies} />
      </main>
      <footer>
        <p>© 2023 Кінотеатр "Реакт". Всі права захищені.</p>
      </footer>
    </div>
  );
}

export default App;