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
