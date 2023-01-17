import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_SPOTS = 'spots/loadSpots' // get/read all spots
const ADD_SPOTS = 'spots/addSpots' // create spots
const EDIT_SPOTS = 'spots/editSpots' // editing/update a spot
const DELETE_SPOTS = 'spots/deleteSpots' // deleting a spot
const LOAD_ONE_SPOT = 'spots/oneSpot' // load one spot
// create POJO action creator to get all spots
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots
})

export const loadOneSpots = (spots) => ({
    type: LOAD_ONE_SPOT,
    payload: spots
})

// create POJO action creator to create the spots
export const createSpots = (spots) => ({
    type: ADD_SPOTS,
    payload: spots
})

// create POJO action creator to edit a spot
export const updateSpots = (spots) => ({
    type: EDIT_SPOTS,
    payload: spots
})

// create POJO action creator to delete a spot
export const removeSpots = () => ({
    type: DELETE_SPOTS
})

// thunk action creator (to get all spots, spot details), was getting an infinite loop here
export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()
    dispatch(loadSpots(data))
    return response
}

// thunk action creator (to get spot by id with the details)
export const getOneSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const spotData = await response.json()
    dispatch(loadOneSpots(spotData))
    return response
}

// thunk action creator (to create the spot)
export const addSpot = (spots) => async (dispatch) => {
    const {address, city, state, country, name, description, price} = spots
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            name,
            description,
            price
        })
    })
    const data = await response.json();
    dispatch(createSpots(data.spots)) // dispatches the 'createSpots' action with returned data
    return response;
}
export const editSpots = (spotId, spots) => async (dispatch) => {
    const {address, city, state, country, name, description, price} = spots
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            name,
            description,
            price
        })
    })
    const data = await response.json()
    dispatch(updateSpots(data.spots))
    return response
}

// initial state for reducer with empty 'entries' array
const initialState = { spots: {}}

// This handles the actions and updates the state
export const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_SPOTS:
            newState = {...state}
            action.payload.Spots.forEach(spot => {
                newState[spot.id] = spot
            });
            return newState
        case LOAD_ONE_SPOT:
            newState = {...state, [action.payload.id]: action.payload }
            return newState
        case ADD_SPOTS:
            newState = {...state} // copy of state
            const newEntries = {...state.spots} // copy the state with the entries
            newEntries[action.payload.spots.id] = action.payload.spots
            newState.spots = newEntries
            return newState
        case EDIT_SPOTS:
            newState[action.payload.id] = {...state[action.payload.id],
                address: action.payload.address,
                city: action.payload.city,
                state: action.payload.state,
                country: action.payload.country,
                name: action.payload.name,
                description: action.payload.description,
                price: action.payload.price
            }
            return newState
        case DELETE_SPOTS:
            newState = {...state} // copy of state
            const newDeleteEntries = {...state.spots} // copy the state with the entries
            delete newDeleteEntries[action.payload.id] // delete state.entries of the spot.id
            newState.spots = newEntries
            return newState
        default:
            return state
    }
}
