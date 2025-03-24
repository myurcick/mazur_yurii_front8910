// src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinemaHall from '../components/CinemaHall';
import { movies } from '../data/movies';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    const foundMovie = movies.find(m => m.id === parseInt(id));
    if (foundMovie) {
      setMovie(foundMovie);
    } else {
      // Redirect to home if movie not found
      navigate('/');
    }
  }, [id, navigate]);

  const handleSeatSelection = (selectedSeats) => {
    setSelectedSeats(selectedSeats);
  };

  const handleBooking = () => {
    if (selectedSeats.length > 0) {
      setBookingComplete(true);
      // In a real app, you would send this data to a server
      console.log("Booking seats:", selectedSeats, "for movie:", movie.title);
    }
  };

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="booking-page">
      <button className="back-button" onClick={() => navigate('/')}>← Back to Movies</button>
      
      <div className="booking-movie-info">
        <img src={movie.image} alt={movie.title} className="booking-movie-image" />
        <div className="booking-details">
          <h1>{movie.title}</h1>
          <p className="booking-genre">{movie.genre}</p>
          <p className="booking-schedule">
            <span>{new Date(movie.date).toLocaleDateString('en-US')}</span>
            <span>{movie.time}</span>
          </p>
        </div>
      </div>

      {bookingComplete ? (
        <div className="booking-confirmation">
          <h2>Booking Complete!</h2>
          <p>You have booked {selectedSeats.length} seat(s):</p>
          <p className="selected-seats">
            {selectedSeats.map(seat => `Row ${seat.row}, Seat ${seat.seat}`).join(', ')}
          </p>
          <button className="book-again-button" onClick={() => setBookingComplete(false)}>
            Book Different Seats
          </button>
        </div>
      ) : (
        <>
          <h2 className="section-title">Select Your Seats</h2>
          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-example available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="seat-example selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="seat-example occupied"></div>
              <span>Occupied</span>
            </div>
          </div>
          
          <CinemaHall onSeatSelect={handleSeatSelection} />
          
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            {selectedSeats.length > 0 ? (
              <>
                <p>Selected {selectedSeats.length} seat(s):</p>
                <p className="selected-seats">
                  {selectedSeats.map(seat => `Row ${seat.row}, Seat ${seat.seat}`).join(', ')}
                </p>
                <p className="total-price">Total: ${selectedSeats.length * 12}</p>
                <button className="confirm-button" onClick={handleBooking}>
                  Confirm Booking
                </button>
              </>
            ) : (
              <p>Please select at least one seat to continue</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Booking;