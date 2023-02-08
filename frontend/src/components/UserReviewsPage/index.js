import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsUser, deleteReview, editReview } from "../../store/review";
import "./userReviewsPage.css";
import { Link } from "react-router-dom";

function UserReviewsPage() {
  const dispatch = useDispatch();
  const reviewsObj = useSelector((state) => state.review.userSpecificReviews);
  const { user } = useSelector((state) => state.session);
  const reviews = Object.values(reviewsObj) || [];
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

  const handleEdit = (reviewId) => {
    setIsEditing(reviewId);
    const reviewToEdit = reviews.find((review) => review.id === reviewId)
    setNewReview(reviewToEdit.review)
    setNewStars(reviewToEdit.stars)
  };

  const handleSave = (reviewId) => {
    setNewReviewData({ review: newReview, stars: newStars });
    dispatch(editReview(reviewId, newReviewData));
    setTimeout(() => {
      dispatch(getAllReviewsUser());
    }, 1000);
    setIsEditing(null);
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
                {/* <button className="edit-review-button" onClick={() => {
                  dispatch(editReview(review.id, newReviewData));
                  setTimeout(() => {
                    dispatch(getAllReviewsUser());
                  }, 1000);
                }}>
                  <i className="fas fa-edit"></i>
              </button> */}
                <button onClick={() => handleEdit(review.id)}>
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
                    <input
                      className="input-type"
                      type="number"
                      min="1"
                      max="5"
                      // step="1"
                      value={newStars}
                      onChange={(e) => setNewStars(e.target.value)}
                    />
                    <button onClick={() => handleSave(review.id)}>Save</button>
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
