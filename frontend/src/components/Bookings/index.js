import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as bookingsAction from "../../store/booking"
import { getAllBookings } from "../../store/booking";

const Bookings = () => {
    const { id } = useParams()
    const dispatch = useDispatch()

    const bookingDetail = useSelector(state => state.booking.getAllBookings)
    // const bookingsArr = Object.values(bookingDetail)
    const user = useSelector(state => state.session.user)
    const spotDetail = useSelector(state => state.spot.singleSpot)

    useEffect(() => {
        dispatch(getAllBookings(id))
    }, [dispatch, id])

    return (
        <div className="booking-container">

        </div>
    )
}

export default Bookings;
