import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../../store/review";
import * as reviewActions from "../../store/review"
import { useParams, useHistory } from "react-router-dom";
import "./createReviewForm.css"
import { useEffect } from "react";
import ReactStars from "react-rating-stars-component";

const CreateReviewForm = () => {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const spotsObj = useSelector(state => state.spot.singleSpot)
    const id = spotsObj.id
    const [review, setReview] = useState(spotsObj.review)
    // const [stars, setStars] = useState(spotsObj.stars)
    const [stars, setStars] = useState(1);
    // const [stars, setStars] = useState('1'); // set initial value to 1
    const [errors, setErrors] = useState([])
    const [showForm, setShowForm] = useState(false)
    const history = useHistory()
    const [showErrors, setShowErrors] = useState(true);

    useEffect(() => {
        if (spotsObj.stars) {
          setStars(spotsObj.stars);
        }
      }, [spotsObj]);

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        if (!review) {
            setErrors(["Please enter a review"]);
            setTimeout(() => {
                setErrors([]);
            }, 2000);
            return;
        }
        // console.log('stars:', stars);
        // console.log('review:', review);
        return dispatch(reviewActions.addOneReview({review, stars, id}, id))
        .then(() => {
            dispatch(getAllReviews(id))
            setReview("")
            // setStars("")
            setStars(1)
            setShowForm(false)
        })
        .catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) {
                setErrors(data.errors)
                setShowForm(true)
                setTimeout(() => {
                    setErrors([])
                }, 2000);
            }
        })
    }
    const handleChange = (e) => {
        if (e.target.value.length <= 150) {
            setReview(e.target.value);
        }
    };

    const ratingChanged = (newRating) => {
        setStars(newRating)
      }
    return (
        <>
            <button className="add-review-button" onClick={() => setShowForm(true)}>Create a Review</button>
            {showForm && (
                <form className="createReviewForm" onSubmit={handleSubmit} noValidate>
                    <h1 className="h1">Add a Review</h1>
                    <ul className="ul">
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <label className="form-label4">
                        <textarea className="input" rows='4' cols='50'
                        value={review}
                        onChange={handleChange}
                        required
                    />
                    {/* <select className="input-type" value={stars} onChange={(e) => setStars(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select> */}
                     <ReactStars
                        count={5}
                        value={stars}
                        onChange={ratingChanged}
                        size={24}
                        // isHalf={true}
                        decimalPlaces={1}
                        emptyIcon={<i className="far fa-star"></i>}
                        // halfIcn={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                    />
                </label>
                <button className="add-review-button" type="Create">Submit</button>
                </form>
            )}
        </>
    )
}

export default CreateReviewForm
