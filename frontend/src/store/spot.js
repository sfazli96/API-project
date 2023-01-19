import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_SPOTS = 'spots/loadSpots' // get/read all spots
const ADD_SPOTS = 'spots/addSpots' // create spots
const EDIT_SPOTS = 'spots/editSpots' // editing/update a spot
const DELETE_SPOTS = 'spots/deleteSpots' // deleting a spot
const LOAD_ONE_SPOT = 'spots/oneSpot' // load one spot
const ADD_PREVIEW_IMAGE = 'spots/loadImage'
// create POJO action creator to get all spots
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots
})

export const addPreviewImage = (spots) => ({
    type: ADD_PREVIEW_IMAGE,
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
export const removeSpots = (spots) => ({
    type: DELETE_SPOTS,
    payload: spots
})

// thunk action creator (to get all spots, spot details)
export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    if (response.ok) {
        const data = await response.json()
        dispatch(loadSpots(data))
        return data
    }
}

// thunk action creator (to get spot by id with the details)
export const getOneSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    if (response.ok) {
        const spotData = await response.json()
        dispatch(loadOneSpots(spotData))
        return spotData
    }
}

export const addSpot = (spots, spotImages) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spots)
    })
    if (response.ok) {
        const data = await response.json()
        console.log('new spot', data)
        const spotId = data.id
        const imageResponse = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            body: JSON.stringify({url: spotImages, preview: true})
        })
        if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            console.log('new spot image', imageData)
            const combined = {...data, ...imageData}
            dispatch(createSpots(combined))
            // dispatch(createSpots(data)) // dispatches the 'createSpots' action with returned data
            // dispatch(addPreviewImage(imageData))
            return combined;
        }
    }
}



export const editSpots = (spotId, spots) => async (dispatch) => {
    // const {address, city, state, country, name, description, price} = spots
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify(spots)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(updateSpots(data.spots))
        return data
    }
}

// Thunk action creator (to delete the spot)
export const deleteSpots = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "DELETE"
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(removeSpots(data))
        return data
    }
}

// initial state for reducer with empty 'entries' array
const initialState = { spots: {}, singleSpot: {}}

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
            newState = {...state, [action.payload.id]: action.payload}
            return newState
        case ADD_SPOTS:
            newState = {...state, spots: {...state.spots, [action.payload.id]: action.payload}};
            return newState;

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
            newState.spots = newDeleteEntries
            return newState
        case ADD_PREVIEW_IMAGE:
            return {
                ...state, singleSpot: {...state.singleSpot, ...action.payload}
            }
        default:
            return state
    }
}
