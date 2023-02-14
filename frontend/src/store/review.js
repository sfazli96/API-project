import { csrfFetch } from "./csrf";

// identify actions in the reducer (CRUD)
const LOAD_REVIEWS = 'reviews/loadReviews' // get/read all reviews from a spot
const ADD_REVIEWS = 'reviews/addReviews' // create reviews
const DELETE_REVIEWS = 'reviews/deleteReviews' // delete a review
const LOAD_USER_REVIEWS = 'reviews/loadUserReviews' // only get reviews of current user
const USER_SPECIFIC_REVIEWS = 'reviews/userSpecificReviews' // get reviews of a specific user
const EDIT_REVIEWS = 'spots/editReviews' // editing/update a review

// create POJO action creator to get all reviews
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    payload: reviews
})

// create POJO action creator to create a review
export const createReview = (reviews) => ({
    type: ADD_REVIEWS,
    payload: reviews
})

// create POJO action creator to remove a review
export const removeReview = (reviews) => ({
    type: DELETE_REVIEWS,
    payload: reviews
})

// create POJO action creator to load all reviews for user
export const loadAllReviewsForUser = (reviews) => ({
    type: LOAD_USER_REVIEWS,
    payload: reviews
})

// create POJO action creator to load user specific reviews
export const loadUserSpecificReviews = (reviews) => ({
    type: USER_SPECIFIC_REVIEWS,
    payload: reviews
})

// create POJO action creator to edit/update reviews
export const updateReview = (reviews) => ({
    type: EDIT_REVIEWS,
    payload: reviews
})


// thunk action creator (to get all reviews for a spot)
export const getAllReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if (response.ok) {
        const reviewData = await response.json()
        dispatch(loadReviews(reviewData))
        return reviewData
    }
}

// thunk action creator (to create a review)
export const addOneReview = (review, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const review = await response.json()
        dispatch(createReview(review))
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
        // dispatch(loadAllReviewsForUser(reviews))
        dispatch(loadUserSpecificReviews(reviews.Review))
        return reviews
    }
}

export const editReview = (review) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const data = await response.json()
        console.log('before dispatch', data)
        dispatch(updateReview(data))
        return data
    }
}

// initialState
const initialState = { allReviews: {}, reviews: {}, userSpecificReviews: {} }

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
        case USER_SPECIFIC_REVIEWS:
            if (!action.payload) return state
            const userSpecificReviews = {};
            action.payload.forEach(review => {
            userSpecificReviews[review.id] = review;
            });
            return { ...state, userSpecificReviews };
        case ADD_REVIEWS:
            newState = { ...state, allReviews: {...state.allReviews}};
            newState.allReviews[action.payload.id] = action.payload;
            return newState
        case EDIT_REVIEWS:
            const updatedReviews = { ...state.reviews }
            updatedReviews[action.payload.id] = action.payload
            return { ...state, reviews: updatedReviews }

            // let updatedReviews = {...state.reviews}
            // updatedReviews[action.payload.id] = action.payload
            // return {...state, reviews: updatedReviews}
            // let updatedReview = {...state.reviews, ...action.payload}
            // return {...state, reviews: updatedReview}
        case DELETE_REVIEWS:
            newState = {...state, allReviews: {...state.allReviews}}
            delete newState.allReviews[action.payload.id]
            return newState
        default:
            return state
    }
}
