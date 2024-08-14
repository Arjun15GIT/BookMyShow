import React, { useState, useEffect } from "react";
import BsContext from "./BsContext";

const BsState = (props) => {
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [time, changeTime] = useState("");
  const [movie, changeMovie] = useState("");
  const [noOfSeat, changeNoOfSeats] = useState({
    A1: "",
    A2: "",
    A3: "",
    A4: "",
    D1: "",
    D2: "",
  });
  const [lastBookingDetails, setLastBookingDetails] = useState(null);

  const handlePostBooking = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/booking', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie, slot: time, seats: noOfSeat }),
      });

      const data = await response.json();
      console.log('Server Response:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${data.message || 'Unknown error'}`);
      }

      setErrorPopup(true);
      setErrorMessage(data.message || 'Booking successful.');

      if (response.status === 200) {
        changeTime("");
        changeMovie("");
        changeNoOfSeats({
          A1: "",
          A2: "",
          A3: "",
          A4: "",
          D1: "",
          D2: "",
        });
        setLastBookingDetails(data.data);
        window.localStorage.clear();
      }
    } catch (error) {
      console.error('Error posting booking:', error);
      setErrorPopup(true);
      setErrorMessage(`An error occurred while booking: ${error.message}`);
    }
  };

  const handleGetLastBooking = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/booking', {
        method: "GET",
      });

      const data = await response.json();
      console.log('Server Response:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${data.message || 'Unknown error'}`);
      }

      setLastBookingDetails(data.data);
    } catch (error) {
      console.error('Error fetching last booking:', error);
    }
  };

  useEffect(() => {
    const movie = window.localStorage.getItem("movie");
    const slot = window.localStorage.getItem("slot");
    const seats = JSON.parse(window.localStorage.getItem("seats"));

    if (movie) {
      changeMovie(movie);
    }
    if (slot) {
      changeTime(slot);
    }
    if (seats) {
      changeNoOfSeats(seats);
    }
  }, []);

  return (
    <BsContext.Provider
      value={{
        handlePostBooking,
        handleGetLastBooking,
        movie,
        changeMovie,
        time,
        changeTime,
        noOfSeat,
        changeNoOfSeats,
        lastBookingDetails,
        errorPopup,
        setErrorPopup,
        errorMessage,
        setErrorMessage,
      }}>
      {props.children}
    </BsContext.Provider>
  );
};

export default BsState;
