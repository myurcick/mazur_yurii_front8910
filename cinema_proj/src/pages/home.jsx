// src/pages/Home.jsx
import React from 'react';
import MovieList from '../components/MovieList';
import { movies } from '../data/movies';

const Home = () => {
  return (
    <div className="home-page">
      <h1 className="page-title">Available Movies</h1>
      <MovieList movies={movies} />
    </div>
  );
};

export default Home;