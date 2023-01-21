import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getAllReviews } from "../../store/review";
// import * as reviewActions from "../../store/review"
import { useHistory, useParams } from "react-router-dom";
import { addOneReview } from "../../store/review";

const CreateReviewForm = (props) => {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const spotsObj = useSelector(state => state.spot.singleSpot)
    const id = spotsObj.id
    const [review, setReview] = useState(spotsObj.review)
    const [stars, setStars] = useState(spotsObj.stars)
    const [errors, setErrors] = useState([])
    const history = useHistory()
    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     setErrors([])

    //     return dispatch(reviewActions.addOneReview({review, stars, id}, id))
    //     .then(() => {
    //         dispatch(getAllReviews(id))
    //     })
    //     .catch(async (res) => {
    //         const data = await res.json()
    //         if (data && data.errors) setErrors(data.errors)
    //     })
    // }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newReview = {
            id: props.id,
            review: review,
            stars: stars
        }
        let updatedReview = await dispatch(addOneReview(newReview, id))
        if (updatedReview) {
            history.push(`/spots/${spotId}`)
        }
    }


    return (
        <form className="createReviewForm" onSubmit={handleSubmit}>
            <h1 className="h1">Add a Review</h1>
            <ul className="ul">
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label className="form-label3">
                Review
                <input className="input"
                type="textarea"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
            />
            </label>
            <label className="form-label3">
                Stars
                <input
                type="number"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                required
            />
        </label>
        <button className="Button" type="Create">Add a Review</button>
        </form>
    )
}

export default CreateReviewForm
