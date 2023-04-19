import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./userBookingsPage.css"
import { getAllBookings } from "../../store/booking";


const UserBookingsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const bookingDetail = useSelector((state) => state.booking.allBookings);
  const bookingsArr = Object.values(bookingDetail);
  const user = useSelector((state) => state.session.user);
  const spotDetail = useSelector((state) => state.spot.singleSpot);
  const spotId = spotDetail.id

  useEffect(() => {
    dispatch(getAllBookings(spotId));
  }, [dispatch, spotId]);

  return (
    <div>
        <h1 className="bookings-root">TEST</h1>
    </div>
  )

}




export default UserBookingsPage;
