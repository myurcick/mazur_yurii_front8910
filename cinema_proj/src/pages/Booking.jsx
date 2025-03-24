// src/pages/Booking.jsx
/*import React, { useState, useEffect } from 'react';
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

export default Booking;*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinemaHall from '../components/CinemaHall';
import { movies } from '../data/movies';

// Local storage booking service
const BookingService = {
  BOOKINGS_KEY: 'movie_bookings',

  saveBooking(movieId, booking) {
    const existingBookings = this.getBookingsForMovie(movieId);
    
    const updatedBookings = [...existingBookings, {
      ...booking,
      timestamp: new Date().toISOString()
    }];

    localStorage.setItem(
      `${this.BOOKINGS_KEY}_${movieId}`, 
      JSON.stringify(updatedBookings)
    );
  },

  getBookingsForMovie(movieId) {
    const bookingsJson = localStorage.getItem(`${this.BOOKINGS_KEY}_${movieId}`);
    return bookingsJson ? JSON.parse(bookingsJson) : [];
  },

  getBookedSeats(movieId) {
    const bookings = this.getBookingsForMovie(movieId);
    return bookings.flatMap(booking => booking.selectedSeats || []);
  }
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [bookingStatus, setBookingStatus] = useState(null);

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

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!bookingInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation (simple regex for basic phone format)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!bookingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(bookingInfo.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!bookingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(bookingInfo.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = () => {
    // Reset previous status
    setBookingStatus(null);

    if (selectedSeats.length === 0) {
      setBookingStatus({ type: 'error', message: 'Please select at least one seat' });
      return;
    }

    if (validateForm()) {
      const bookingData = {
        ...bookingInfo,
        selectedSeats,
        movieId: id
      };

      try {
        BookingService.saveBooking(id, bookingData);
        
        setBookingComplete(true);
        setBookingStatus({ type: 'success', message: 'Booking successful!' });
      } catch (error) {
        setBookingStatus({ type: 'error', message: 'Booking failed. Please try again.' });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetBooking = () => {
    setBookingComplete(false);
    setSelectedSeats([]);
    setBookingInfo({ name: '', phone: '', email: '' });
    setBookingStatus(null);
  };

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="booking-page">
      <button className="back-button" onClick={() => navigate('/')}>← Back to Movies</button>

      {/* Booking Status Message */}
      {bookingStatus && (
        <div className={`p-3 mb-4 rounded ${
          bookingStatus.type === 'success' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {bookingStatus.message}
        </div>
      )}

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
          <button className="book-again-button" onClick={handleResetBooking}>
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

        <CinemaHall onSeatSelect={handleSeatSelection} bookedSeats={BookingService.getBookedSeats(id)} />

          <div className="booking-summary">
            <h3>Booking Information</h3>
            {selectedSeats.length > 0 ? (
              <form className="space-y-4">
                <div className="booking-form-group">
                  <input
                    type="text"
                    name="name"
                    value={bookingInfo.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
                <div className="booking-form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={bookingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                </div>
                <div className="booking-form-group">
                  <input
                    type="email"
                    name="email"
                    value={bookingInfo.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>

                <p>Selected {selectedSeats.length} seat(s):</p>
                <p className="selected-seats">
                  {selectedSeats.map(seat => `Row ${seat.row}, Seat ${seat.seat}`).join(', ')}
                </p>
                <p className="total-price">Total: ${selectedSeats.length * 12}</p>
                
                <button 
                  type="button"
                  className="confirm-button w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" 
                  onClick={handleBooking}
                >
                  Confirm Booking
                </button>
              </form>
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