import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as bookingsAction from "../../store/booking";
import { getAllBookings } from "../../store/booking";
import Calendar from "react-calendar";
import "./bookings.css";
import 'react-calendar/dist/Calendar.css';
import { addBookings } from "../../store/booking";

const Bookings = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const bookingDetail = useSelector((state) => state.booking.allBookings);
  const bookingsArr = Object.values(bookingDetail);
  const user = useSelector((state) => state.session.user);
  const spotDetail = useSelector((state) => state.spot.singleSpot);
  const spotId = spotDetail.id
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    dispatch(getAllBookings(spotId));
  }, [dispatch, spotId]);

  const [selectedRange, setSelectedRange] = useState([null, null]);

  const onRangeChange = (range) => {
    setSelectedRange(range);
  };

  const handleCreateBooking = () => {
    const startDate = selectedRange[0]
    const endDate = selectedRange[1]
    const userId = user.id

    if (!startDate || !endDate) {
      return;
    }

    if (endDate <= startDate) {
      alert("End Date must be after start date")
      return
    }

    if (userId === spotDetail.userId) {
      alert("You cannot create a booking for a spot that belongs to you");
      return
    }

    const hasOverlappingDates = (startDate, endDate, bookingStart, bookingEnd) => {
      return (
        (startDate >= bookingStart && startDate < bookingEnd) ||
        (endDate > bookingStart && endDate <= bookingEnd) ||
        (startDate <= bookingStart && endDate >= bookingEnd)
      );
    };


    const conflicts = (startDate, endDate, bookingsArr) => {
      for (const { startDate: bookingStart, endDate: bookingEnd } of bookingsArr) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const bookingStartObj = new Date(bookingStart);
        const bookingEndObj = new Date(bookingEnd);
        if (hasOverlappingDates(start, end, bookingStartObj, bookingEndObj)) {
          return true;
        }
      }
      return false;
    };


    if (conflicts(startDate, endDate, bookingsArr)) {
      alert("The selected dates conflict with an existing booking");
      return;
    }

    dispatch(addBookings({spotId: id, startDate, endDate, userId}));
    setSelectedRange([null, null]);
  }

  return (
    <div className="booking-container">
      <button className='show-calendar' onClick={() => setShowCalendar(!showCalendar)}>
        {showCalendar ? "Hide Calendar" : " Show Calendar"}
      </button>
      {showCalendar ? (
        user.id === spotDetail.userId ? (
          <>
            <h2>Bookings for your spot</h2>
            <ul>
              {bookingsArr
              .filter(booking => booking.spotId === id)
              .map(({id, spotId, userId, startDate, endDate, firstName, lastName}) => (
                  <li key={id}>
                    <p>
                      User: {firstName} {lastName}
                    </p>
                    <p>Start Date: {startDate}</p>
                    <p>End Date: {endDate}</p>
                  </li>
                )
              )}
            </ul>
          </>
        ) : (
          <>
            <div className="calendar-container">
              <Calendar
                onChange={onRangeChange}
                value={selectedRange}
                selectRange={true}
                className="calendar"
              />
              <p>Selected range: {selectedRange[0] ? selectedRange[0].toLocaleDateString() : 'None'} to {selectedRange[1] ? selectedRange[1].toLocaleDateString() : 'None'}</p>
            </div>
            <button onClick={handleCreateBooking}>Create Booking</button>
          </>
        )
      ) : null}
    </div>
  );
}

export default Bookings;
