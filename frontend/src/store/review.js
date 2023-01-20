// import { csrfFetch } from "./csrf";

// // identify actions in the reducer (CRUD)
// const LOAD_REVIEWS = 'reviews/loadReviews' // get/read all reviews from a spot
// const ADD_REVIEWS = 'reviews/addReviews' // create reviews
// const LOAD_USER_REVIEWS - 'reviews/userReviews' // load the user review
// const DELETE_REVIEWS = 'reviews/deleteReviews' // delete a review

// // create POJO action creator to get all reviews
// export const loadReviews = (reviews) => ({
//     type: LOAD_REVIEWS,
//     payload: reviews
// })

// create POJO action creator to get reviews for a user
// const loadAllReviews = (reviews) => ({
//     type: LOAD_USER_REVIEWS,
//     payload: reviews
// })

// // create POJO action creator to create a review
// const createReview = (reviews) => ({
//     type: ADD_REVIEWS,
//     payload: reviews
// })

// // create POJO action creator to remove a review
// const removeReview = (reviews) => ({
//     type: DELETE_REVIEWS,
//     payload: reviews
// })

// thunk action creator (to get all reviews for a spot)
// export const getAllReviews = (spotId) => async (dispatch) => {
//     const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
//     if (response.ok) {
//         const reviewData = await response.json()
//         dispatch(loadReviews(reviewData))
//         return reviewData
//     }
// }

// // thunk action creator (to get all reviews for a user)
// export const allReviews = () => async (dispatch) => {
//     const response = await csrfFetch(`/api/reviews/current`)
//     if (response.ok) {
//         const data = await response.json()
//         dispatch(loadAllReviews(data))
//     }
// }

// // thunk action creator (to create a review)
// export const addOneReview = (review, spotId) => async (dispatch) => {
//     const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//         method: 'POST',
//         body: JSON.stringify(review)
//     })
//     if (response.ok) {
//         const data = await response.json()
//         dispatch(createReview(review))
//         return data
//     }
// }

// // thunk action creator (to delete a review)
// export const deleteReview = (reviewId) => async(dispatch) => {
//     const response = await csrfFetch(`/api/reviews/${reviewId}`, {
//         method: 'DELETE'
//     })
//     if (response.ok) {
//         const data = await response.json()
//         dispatch(deleteReview(data))
//         return data
//     }
// }

// // initialState
// const initialState = { spot: {}, user: {} }

// export const reviewsReducer = (state = initialState, action) => {
//     let newState;
//     switch (action.type) {
//         case LOAD_REVIEWS:
//             newState = {...state}
//             newState = {spot: {}, user: {}}
//             action.payload.Reviews.forEach(rev => {
//                 newState.spot[rev.id] = rev
//             });
//             return newState
//         case LOAD_USER_REVIEWS:
//             newState = {...state}
//             newState = {spot: {}, user: {}}
//             action.payload.Reviews.forEach(rev => {
//                 newState.user[rev.id] = rev
//             });
//             return newState
//         case ADD_REVIEWS:
//             newState = {...state}
//             newState.spot[action.payload.id] = action.payload
//             return newState
//         case DELETE_REVIEWS:
//             newState = {...state, spot: {...state.spot}}
//             delete newState.spot[action.payload.id]
//         default:
//             return state
//     }
// }
