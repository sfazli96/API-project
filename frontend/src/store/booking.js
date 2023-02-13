import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_BOOKINGS = 'bookings/loadBookings' // get/read all bookings from a spot
const ADD_BOOKINGS = 'bookings/addBookings' // create/add a booking
const EDIT_BOOKINGS = 'bookings/editBookings' // edit bookings
const DELETE_BOOKINGS = 'bookings/deleteBooking' // delete bookings

// create POJO action creator to get all bookings
export const loadBookings = (bookings) => ({
    type: LOAD_BOOKINGS,
    payload: bookings
})

// create POJO action creator to create a booking
export const createBooking = (bookings) => ({
    type: ADD_BOOKINGS,
    payload: bookings
})

// create POJO action creator to remove a booking
export const removeBooking = (bookings) => ({
    type: DELETE_BOOKINGS,
    payload: bookings
})

export const updateBookings = (bookings) => ({
    type: EDIT_BOOKINGS,
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
export const addBookings = (booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${booking.id}/bookings`, {
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
export const deleteBooking = (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(removeBooking(data))
        return data
    }
}

export const editBookings = (booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(updateBookings(data))
        // console.log('after dispatch', data)
        return data
    }
}

// initialState
// const initialState = { allBookings: {}, user: {}, spot: {} }
const initialState = { allBookings: {}, singleBooking: {} }

export const bookingsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_BOOKINGS:
            newState = { ...state }
            let copy = {}
            action.payload.Booking.forEach(booking => {
                copy[booking.id] = booking
            });
            newState.allBookings = copy
            return newState
        case ADD_BOOKINGS:
            newState = { ...state }
            let copy2 = { ...newState.allBookings }
            copy[action.payload.id] = action.payload
            newState.allBookings = copy2
            return newState;
        case EDIT_BOOKINGS:
            const updatedBookings = { ...state.singleBooking }
            updatedBookings[action.payload.id] = action.payload
            return { ...state, singleBooking: updatedBookings }
        case DELETE_BOOKINGS:
            newState = { ...state, allBookings: { ...state.allBookings } }
            delete newState.allBookings[action.payload.id]
            return newState
        default:
            return state
    }
}
