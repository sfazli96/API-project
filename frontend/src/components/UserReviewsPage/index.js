import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsUser } from "../../store/review";

function UserReviewsPage() {
  const dispatch = useDispatch();
  const reviewsObj = useSelector(state => state.review.allReviews)
  // const reviewsObj = useSelector(state => state.review.reviews)
  // const reviews = reviewsObj && reviewsObj.reviews && Object.values(reviewsObj.reviews) || [];
  const reviews = Object.values(reviewsObj) || []
  console.log({reviews}, 'reviews')
  const [validationErrors, setValidationErrors] = useState([]);
  useEffect(() => {
    dispatch(getAllReviewsUser());
  }, [dispatch]);

  useEffect(() => {
    const errors = [];

    if (reviews.length === 0) {
      errors.push("No reviews are here, make a review on a spot");
    } else {
      setValidationErrors([])
    }
    // setValidationErrors(errors);
  }, [reviews.length]);

  if (reviews.length === 0) return null

  return (
    <>
      <h1>User Reviews</h1>
      <ul className="user-review-error">
        {validationErrors.map((error) => (
          <div key={error}>{error}</div>
        ))}
      </ul>
      <div>
        {reviews.map(review => (
          <div className="user-review-container" key={review.id}>
            <div>Spot Name: {review.Spot?.name || 'N/A'}</div>
            <div>
              Address: {review.Spot?.address || 'N/A'}, {review.Spot?.city || 'N/A'}, {review.Spot?.state || 'N/A'}
            </div>
            <div className="user-review">Review: {review.review}</div>
            <div className="user-review-stars">Stars: {review.stars}</div>
            <div className="user-review-createdAt">CreatedAt: {new Date(review.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </>
  );

}

export default UserReviewsPage;
