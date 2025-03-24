// src/components/CinemaHall.jsx
import React, { useState } from 'react';

const CinemaHall = ({ onSeatSelect }) => {
  // Cinema layout configuration
  const rows = 8;
  const seatsPerRow = 10;
  
  // Randomly generate some occupied seats
  const generateOccupiedSeats = () => {
    const occupied = [];
    const occupiedCount = Math.floor(Math.random() * 20) + 10; // 10-30 seats occupied
    
    for (let i = 0; i < occupiedCount; i++) {
      const row = Math.floor(Math.random() * rows) + 1;
      const seat = Math.floor(Math.random() * seatsPerRow) + 1;
      const key = `${row}-${seat}`;
      if (!occupied.includes(key)) {
        occupied.push(key);
      }
    }
    
    return occupied;
  };
  
  const [occupiedSeats] = useState(generateOccupiedSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const handleSeatClick = (row, seat) => {
    const seatKey = `${row}-${seat}`;
    
    // Check if the seat is occupied
    if (occupiedSeats.includes(seatKey)) return;
    
    let newSelectedSeats;
    
    if (selectedSeats.some(s => s.key === seatKey)) {
      // If already selected, remove it
      newSelectedSeats = selectedSeats.filter(s => s.key !== seatKey);
    } else {
      // If not selected, add it
      newSelectedSeats = [...selectedSeats, { key: seatKey, row, seat }];
    }
    
    setSelectedSeats(newSelectedSeats);
    
    // Notify parent component
    onSeatSelect(newSelectedSeats);
  };
  
  const getSeatStatus = (row, seat) => {
    const seatKey = `${row}-${seat}`;
    
    if (occupiedSeats.includes(seatKey)) {
      return 'occupied';
    }
    
    if (selectedSeats.some(s => s.key === seatKey)) {
      return 'selected';
    }
    
    return 'available';
  };
  
  // Generate cinema hall layout
  const renderSeats = () => {
    const seatRows = [];
    
    for (let row = 1; row <= rows; row++) {
      const seats = [];
      
      // Add row number
      seats.push(
        <div key={`row-${row}`} className="row-number">
          {row}
        </div>
      );
      
      // Add seats in this row
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const status = getSeatStatus(row, seat);
        
        seats.push(
          <div
            key={`seat-${row}-${seat}`}
            className={`seat ${status}`}
            onClick={() => handleSeatClick(row, seat)}
            title={`Row ${row}, Seat ${seat}`}
          >
            {seat}
          </div>
        );
      }
      
      seatRows.push(
        <div key={`row-${row}`} className="seat-row">
          {seats}
        </div>
      );
    }
    
    return seatRows;
  };
  
  return (
    <div className="cinema-hall">
      <div className="screen">
        <div className="screen-text">SCREEN</div>
      </div>
      <div className="seats-container">
        {renderSeats()}
      </div>
    </div>
  );
};

export default CinemaHall;