import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_REVIEWS = 'reviews/loadReviews' // get/read all reviews from a spot
const ADD_REVIEWS = 'reviews/addReviews' // create reviews
const DELETE_REVIEWS = 'reviews/deleteReviews' // delete a review
const LOAD_USER_REVIEWS = 'reviews/loadUserReviews' // only get reviews of current user

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

const loadAllReviewsForUser = (reviews) => ({
    type: LOAD_USER_REVIEWS,
    payload: reviews
})

// thunk action creator (to get all reviews for a spot)
export const getAllReviews = (spotId) => async (dispatch) => {
    // console.log('spotId to get all', spotId)
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if (response.ok) {
        const reviewData = await response.json()
        console.log({reviewData})
        dispatch(loadReviews(reviewData))
        return reviewData
    }
}

// thunk action creator (to create a review)
export const addOneReview = (review, spotId) => async (dispatch) => {
    // console.log('review', review)

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const review = await response.json()
        dispatch(createReview(review))
        console.log('after dispatch in thunk', review)
        return review
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

// thunk action creator (to get all reviews of CURRENT user)
export const getAllReviewsUser = () => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/current`)
    if (response.ok) {
        const reviews = await response.json()
        console.log({reviews}, 'before dispatch')
        dispatch(loadAllReviewsForUser(reviews))
        return reviews
    }
}

// initialState
const initialState = { allReviews: {}, reviews: {} }

export const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_REVIEWS:
            newState = {...state}
            let copyState = {}
            action.payload.Review.forEach(review => {
                copyState[review.id] = review
            });
            newState.allReviews = copyState
            return newState
        case LOAD_USER_REVIEWS:
            if (!action.payload) return state
            const allReviews = {};
            action.payload.forEach(review => {
            allReviews[review.id] = review;
            });
            return { ...state, allReviews };

        case ADD_REVIEWS:
            // newState = {...state}
            // newState.allReviews[action.payload.id] = action.payload
            // return newState
            newState = { ...state, allReviews: {...state.allReviews}};
            newState.allReviews[action.payload.id] = action.payload;
            return newState
        case DELETE_REVIEWS:
            newState = {...state, allReviews: {...state.allReviews}}
            delete newState.allReviews[action.payload.id]
            return newState
        default:
            return state
    }
}
