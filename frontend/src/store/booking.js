import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_BOOKINGS = 'bookings/loadBookings' // get/read all bookings from a spot
const ADD_BOOKINGS = 'bookings/addBookings' // create/add a booking
const DELETE_BOOKINGS = 'bookings/deleteBooking' // delete bookings

// create POJO action creator to get all bookings
export const loadBookings = (bookings) => ({
    type: LOAD_BOOKINGS,
    payload: bookings
})

// create POJO action creator to create a booking
const createBooking = (bookings) => ({
    type: ADD_BOOKINGS,
    payload: bookings
})

// create POJO action creator to remove a booking
const removeBooking = (bookings) => ({
    type: DELETE_BOOKINGS,
    payload: bookings
})

// thunk action creator (to get all bookings for a spot)
export const getAllBookings = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`)
    if (response.ok) {
        const bookingData = await response.json()
        // console.log({bookingData})
        dispatch(loadBookings(bookingData))
        return bookingData
    }
}

// thunk action creator (to create a booking)
export const addBookings = (booking, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        body: JSON.stringify(booking)
    })
    if (response.ok) {
        const booking = await response.json()
        dispatch(createBooking(booking))
        return booking
    }
}

// thunk action creator (to delete a booking)
export const deleteBooking = (bookingId) => async(dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(removeBooking(data))
        return data
    }
}

// initialState
const initialState = { user: {}, spot: {} }

export const bookingsReducer = (state= initialState, action) => {
    let newState;
}
