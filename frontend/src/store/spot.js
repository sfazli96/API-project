import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_SPOTS = 'spots/loadSpots' // get/read all spots
const ADD_SPOTS = 'spots/addSpots' // create spots
const EDIT_SPOTS = 'spots/editSpots' // editing/update a spot
const DELETE_SPOTS = 'spots/deleteSpots' // deleting a spot

// create POJO action creator to get all spots
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

// create POJO action creator to create the spots
export const createSpots = (spots) => ({
    type: ADD_SPOTS,
    spots
})

// create POJO action creator to edit a spot
// export const modifySpots = (spots) => ({
//     type: EDIT_SPOTS,
//     spots
// })

// create POJO action creator to delete a spot
// export const removeSpots = () => ({
//     type: DELETE_SPOTS
// })

// thunk action creator (to get all spots), getting an infinite loop here
export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()
    dispatch(loadSpots(data))
    return response
}

// thunk action creator (to create the spot)
export const addSpot = (spots) => async (dispatch) => {
    const {address, city, state, country, lat, lng, name, description, price} = spots
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    })
    const data = await response.json();
    dispatch(createSpots(data.spots)) // dispatches the 'createSpots' action with returned data
    return response;
}



// exports a normalize function
// takes in an array of spots
// returns an object with spot id as key and spot obj as value, to access data
const normalize = (spots) => {
    const normalizeObj = {}
    spots.forEach(spot => {
        normalizeObj[spot.id] = spot;
    });
    return normalizeObj
}

// initial state for reducer with empty 'entries' array
const initialState = { entries: []}

// This handles the actions and updates the state
export const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_SPOTS:
            const allSpots = {}
            action.spots.forEach(spot => {
                allSpots[spot.id] = spot
            });
            return {...allSpots, ...state, entries: normalize(action.spots)}
        case ADD_SPOTS:
            const addState = {...state}
            addState[action.spots.id] = action.spots
            return addState
        default:
            return state
    }
}
