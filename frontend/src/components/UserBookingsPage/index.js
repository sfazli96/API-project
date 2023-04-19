import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./userBookingsPage.css"
import { getAllBookingUser } from "../../store/booking";


const UserBookingsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const bookingDetail = useSelector((state) => state.booking.allBookings);
  const bookingsArr = Object.values(bookingDetail);
  const user = useSelector((state) => state.session.user);
  const spotDetail = useSelector((state) => state.spot.singleSpot);
  const spotId = spotDetail.id

  useEffect(() => {
    if (user) {
      dispatch(getAllBookingUser(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="booking-upper-root">
      <h1 className="bookings-root">My Bookings</h1>
      {bookingDetail && bookingsArr.map((booking) => (
        <div key={booking.id}>
          <p className="booking-startDate">StartDate: {booking.startDate}</p>
          <p className="booking-endDate">EndDate: {booking.endDate}</p>
        </div>
      ))}
    </div>
  );

}




export default UserBookingsPage;
