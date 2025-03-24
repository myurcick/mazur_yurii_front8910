// src/services/BookingService.js
class BookingService {
    // Key for storing bookings in localStorage
    static BOOKINGS_KEY = 'movie_bookings';
  
    // Save booking for a specific movie
    static saveBooking(movieId, booking) {
      // Get existing bookings from localStorage
      const existingBookings = this.getBookingsForMovie(movieId);
      
      // Add new booking
      const updatedBookings = [...existingBookings, {
        ...booking,
        timestamp: new Date().toISOString()
      }];
  
      // Save to localStorage
      localStorage.setItem(
        `${this.BOOKINGS_KEY}_${movieId}`, 
        JSON.stringify(updatedBookings)
      );
    }
  
    // Get bookings for a specific movie
    static getBookingsForMovie(movieId) {
      const bookingsJson = localStorage.getItem(`${this.BOOKINGS_KEY}_${movieId}`);
      return bookingsJson ? JSON.parse(bookingsJson) : [];
    }
  
    // Get booked seats for a specific movie
    static getBookedSeats(movieId) {
      const bookings = this.getBookingsForMovie(movieId);
      return bookings.flatMap(booking => booking.selectedSeats);
    }
  
    // Check if a seat is already booked
    static isSeatBooked(movieId, seat) {
      const bookedSeats = this.getBookedSeats(movieId);
      return bookedSeats.includes(seat);
    }
  }
  
  export default BookingService;