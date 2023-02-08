import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_SPOTS = 'spots/loadSpots' // get/read all spots
const ADD_SPOTS = 'spots/addSpots' // create spots
const EDIT_SPOTS = 'spots/editSpots' // editing/update a spot
const DELETE_SPOTS = 'spots/deleteSpots' // deleting a spot
const LOAD_ONE_SPOT = 'spots/oneSpot' // load one spot
// const USER_SPECIFIC_SPOTS = 'reviews/userSpecificSpots' // get spots of a specific user
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
export const removeSpots = (id) => ({
    type: DELETE_SPOTS,
    payload: id
})

// export const loadUserSpecificSpots = (spots) => ({
//     type: USER_SPECIFIC_SPOTS,
//     payload: spots
// })

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
    const spotData = await response.json()
    dispatch(loadOneSpots(spotData))
    return spotData
}

export const addSpot = (spots, spotImages) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spots)
    })
    if (response.ok) {
        const data = await response.json()
        // console.log('new spot', data)
        const spotId = data.id
        const imageResponse = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            body: JSON.stringify({url: spotImages, preview: true})
        })
        if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            // console.log('new spot image', imageData)
            const combined = {...data, previewImage: imageData.url}
            combined.avgRating = 'no reviews are found'
            dispatch(createSpots(combined))
            return combined;
        }
    }
}



export const editSpots = (spots) => async (dispatch) => {
    // console.log('spots', spots)
    const response = await csrfFetch(`/api/spots/${spots.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spots)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(updateSpots(data))
        // console.log('after dispatch', data)
        return data
    }
}

// Thunk action creator (to delete the spot)
export const deleteSpots = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(removeSpots(data))
        return data
    }
}

// export const getAllSpotUser = () => async (dispatch) => {
//     const response = await csrfFetch(`/api/spots/current`)
//     if (response.ok) {
//         const spots = await response.json()
//         dispatch(loadUserSpecificSpots(spots.Spots))
//         return spots
//     }
// }

// initial state for reducer with empty 'entries' array
const initialState = { allSpots: {}, singleSpot: {}, userSpecificSpots: {}}

// This handles the actions and updates the state
export const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_SPOTS:
            newState = {...state}
            newState = { allSpots: {}, singleSpot: {}}
            action.payload.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            });
            return newState
        case LOAD_ONE_SPOT:
            newState = {...state}
            newState.singleSpot = action.payload
            return newState
        // case USER_SPECIFIC_SPOTS:
        //     if (!action.payload) return state
        //         const userSpecificSpots = {}
        //         action.payload.forEach(spot => {
        //             userSpecificSpots[spot.id] = spot
        //         });
        //     return { ...state, userSpecificSpots }
        case ADD_SPOTS:
            newState = {...state}
            let copy = {...newState.allSpots}
            copy[action.payload.id] = action.payload
            newState.allSpots = copy
            return newState
        case EDIT_SPOTS:
            let updateSingleSpot = {...state.singleSpot, ...action.payload}
            return {...state,singleSpot: updateSingleSpot}
        case DELETE_SPOTS:
            newState = {...state, singleSpot: {...state.singleSpot}} // copy of state
            delete newState.singleSpot[action.payload.id] // delete state.entries of the spot.id
            return newState
        default:
            return state
    }
}
