import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_REVIEWS = 'reviews/loadReviews' // get/read all reviews from a spot
const ADD_REVIEWS = 'reviews/addReviews' // create reviews
const DELETE_REVIEWS = 'reviews/deleteReviews' // delete a review

// create POJO action creator to get all reviews
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    payload: reviews
})

// create POJO action creator to create a review
const createReview = (reviews) => ({
    type: ADD_REVIEWS,
    payload: reviews
})

// create POJO action creator to remove a review
const removeReview = (reviews) => ({
    type: DELETE_REVIEWS,
    payload: reviews
})

// thunk action creator (to get all reviews for a spot)
export const getAllReviews = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot}/reviews`)
    if (response.ok) {
        const reviewData = await response.json()
        dispatch(loadReviews(reviewData))
        return reviewData
    }
}

// thunk action creator (to create a review)
export const addOneReview = (review, id) => async (dispatch) => {
    console.log('review', review)

    const response = await csrfFetch(`/api/spots/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(createReview(review))
        return data
    }
}

// thunk action creator (to delete a review)
export const deleteReview = (reviewId) => async(dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(removeReview(data))
        return data
    }
}

// initialState
const initialState = { allReviews: {}, reviews: {} }

export const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_REVIEWS:
            newState = {...state}
            let copy = {}
            action.payload.Review.forEach(review => {
                copy[review.id] = review
            });
            newState.allReviews = copy
            return newState
        case ADD_REVIEWS:
            newState = {...state}
            let copy2 = {...newState.allReviews}
            copy2[action.payload.id] = action.payload
            newState.allReviews = copy2
            return newState
        case DELETE_REVIEWS:
            newState = {...state, allReviews: {...state.allReviews}}
            delete newState.allReviews[action.payload.id]
            return newState
        default:
            return state
    }
}
