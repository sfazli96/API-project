import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as bookingsAction from "../../store/booking";
import { getAllBookings } from "../../store/booking";
import Calendar from "react-calendar";
import "./bookings.css";
import 'react-calendar/dist/Calendar.css';

const Bookings = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const bookingDetail = useSelector((state) => state.booking.allBookings);
  const bookingsArr = Object.values(bookingDetail);
  const user = useSelector((state) => state.session.user);
  const spotDetail = useSelector((state) => state.spot.singleSpot);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    dispatch(getAllBookings(spotId));
  }, [dispatch, spotId]);

  const [selectedRange, setSelectedRange] = useState([null, null]);

  const onRangeChange = (range) => {
    setSelectedRange(range);
  };

  return (
    <div className="booking-container">
      <button className='show-calendar' onClick={() => setShowCalendar(!showCalendar)}>
        {showCalendar ? "Hide Calendar" : "Show Calendar"}
      </button>
      {showCalendar ? (
        user.id === spotDetail.userId ? (
          <>
            <h2>Bookings for your spot</h2>
            <ul>
              {bookingsArr.map(({id, spotId, userId, startDate, endDate, firstName, lastName}) => (
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
          </>
        )
      ) : null}
    </div>
  );
};

export default Bookings;
