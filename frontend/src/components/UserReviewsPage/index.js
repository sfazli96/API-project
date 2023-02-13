import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsUser, deleteReview, editReview } from "../../store/review";
import "./userReviewsPage.css";
import { Link } from "react-router-dom";

function UserReviewsPage() {
  const dispatch = useDispatch();
  const reviewsObj = useSelector((state) => state.review.userSpecificReviews);
  // console.log('reviewsOBJ', reviewsObj)
  const { user } = useSelector((state) => state.session);
  const reviews = Object.values(reviewsObj) || {} || [];
  const [newReviewData, setNewReviewData] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newStars, setNewStars] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  useEffect(() => {
    if (user)
      dispatch(getAllReviewsUser());
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) {
      setValidationErrors(["You must be logged in to see your reviews!"]);
    } else if (reviews.length === 0) {
      setValidationErrors(["No reviews are here, make a review on a spot"]);
    } else {
      setValidationErrors([]);
    }
  }, [reviews.length, user]);

  // set isEditing state to id of the review being edited
  // update the state variables 'newReviewData', 'newReview' and 'newStars' with the values of review being edited
 const handleEdit = (review) => {
  setIsEditing(review.id);
  setNewReviewData({ id: review.id, review: review.review, stars: review.stars });
  setNewReview(review.review);
  setNewStars(review.stars);
};

// This function dispatches the editReview action with an object containing the id of the review being edited
const handleSave = async () => {
  await dispatch(editReview({ id: newReviewData.id, review: newReview, stars: newStars}));
  dispatch(getAllReviewsUser());
  setIsEditing(null);
};


const handleCancel = () => {
  setIsEditing(null);
  setNewReview("");
  setNewStars("");
};

  return (
    <>
      <h1>User Reviews</h1>
      {validationErrors.length > 0 ? (
        <ul className="user-review-error">
          {validationErrors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </ul>
      ) : (
        validationErrors.length === 0 &&
        <div className="user-review-container">
          {reviews.reverse()?.map((review) => (
            <div className="single-review" key={review.id}>
              <div className="review-container-text">
                {/* <div>Spot Name: {review.Spot?.name || "N/A"}</div> */}
                <div>
                  <Link to={`/spots/${review.Spot.id}`} className="spot-link">
                    {review.Spot?.name || "N/A"}
                  </Link>
                </div>
                <div>
                  Address: {review.Spot?.address || "N/A"},{" "}
                  {review.Spot?.city || "N/A"}, {review.Spot?.state || "N/A"}
                </div>
                <div className="user-review">{review.review}</div>
                <div className="star-in-date">
                  <div className="user-review-stars">Stars: {review.stars}</div>
                  <div className="user-review-createdAt">
                  </div>
                  CreatedAt: {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="delete-review-container">
                <button className="delete-review-button" onClick={() => {
                  dispatch(deleteReview(review.id));
                  setTimeout(() => {
                    dispatch(getAllReviewsUser());
                  }, 1000);
                }}>
                  <i className="fas fa-trash-alt"></i>
                </button>
                <button className='edit-review-button' onClick={() => handleEdit(review)}>
                  <i className="fas fa-edit"></i>
                </button>

                {isEditing === review.id ? (
                  <div className="edit-review-form">
                    <textarea
                      placeholder="Edit your review"
                      className="text-area"
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                    />
                    {/* <input
                      className="input-type"
                      type="number"
                      min="1"
                      max="5"
                      value={newStars}
                      onChange={(e) => setNewStars(e.target.value)}
                    /> */}
                    <select className="input-type" value={newStars} onChange={(e) => setNewStars(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <button className='save-review' onClick={() => handleSave(review)}>Save</button>
                    <button className="cancel-review" onClick={() => handleCancel(review)}>Cancel</button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default UserReviewsPage;
