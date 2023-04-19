import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./userBookingsPage.css"
import { deleteBooking, getAllBookingUser } from "../../store/booking";


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

  if (!bookingDetail) {
    return null
  }

  if (!user) {
    return (
      <div>
        <h1 className="sign-in-user-bookings">Sign in to see your bookings</h1>
      </div>
    )
  }

  return (
    <div className="booking-upper-root">
      <h1 className="bookings-root">My Bookings</h1>
      {bookingDetail && bookingsArr.map((booking) => (
        <div key={booking.id}>
          <p className="booking-startDate">StartDate: {booking.startDate}</p>
          <p className="booking-endDate">EndDate: {booking.endDate}</p>
          <button className="delete-booking-button" onClick={() => {
              dispatch(deleteBooking(booking.id));
              setTimeout(() => {
                dispatch(getAllBookingUser());
              }, 1000);
            }}>
              Delete Booking
          </button>
        </div>
      ))}
    </div>
  );

}




export default UserBookingsPage;
