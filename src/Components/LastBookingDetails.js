import React, { useEffect, useState, useContext } from "react";
import "../Css/LastBookingDetails.css"; // Import styling for the component
import BsContext from "../Context/BsContext"; // Import context for managing state
import { seats } from "../data"; // Import seat data for rendering

const LastBookingDetails = () => {
  // Access context using the useContext hook
  const context = useContext(BsContext);

  // Destructure values from the context
  const { handleGetLastBooking, lastBookingDetails } = context;
  
  // Local state for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch last booking details when the component mounts
  useEffect(() => {
    const fetchLastBookingDetails = async () => {
      try {
        await handleGetLastBooking(); // Call the API to get last booking details
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        console.error('Error fetching last booking details:', err);
        setError('Failed to load last booking details.');
        setLoading(false);
      }
    };

    fetchLastBookingDetails();
  }, [handleGetLastBooking]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="last_booking_details_container_main">
      <h2 className="last_booking_details_header">Last Booking Details:</h2>
      {error ? (
        <p className="error_message">{error}</p>
      ) : lastBookingDetails ? (
        <>
          <div className="seats_container">
            <p className="seats_header">Seats:</p>
            <ul className="seats">
              {seats.map((seat, index) => (
                <li className="seat_value" key={index}>
                  {seat}: {Number(lastBookingDetails.seats[seat]) || 0}
                </li>
              ))}
            </ul>
          </div>
          <p className="slot" style={{ textAlign: "left" }}>
            Slot: <span>{lastBookingDetails.slot}</span>
          </p>
          <p className="movie">
            Movie: <span>{lastBookingDetails.movie}</span>
          </p>
        </>
      ) : (
        <p className="no_previous_booking_msg">No Previous Booking Found!</p>
      )}
    </div>
  );
};

export default LastBookingDetails;
