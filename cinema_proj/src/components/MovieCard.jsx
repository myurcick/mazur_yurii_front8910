// src/components/MovieCard.jsx
import React from 'react';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-image">
        <img src={movie.image} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-description">{movie.description}</p>
        <div className="movie-details">
          <span className="movie-genre">{movie.genre}</span>
          <div className="movie-schedule">
            <span className="movie-date">{new Date(movie.date).toLocaleDateString('uk-UA')}</span>
            <span className="movie-time">{movie.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;