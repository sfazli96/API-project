import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsUser } from "../../store/review";
import "./userReviewsPage.css";

function UserReviewsPage() {
  const dispatch = useDispatch();
  const reviewsObj = useSelector((state) => state.review.userSpecificReviews);
  const { user } = useSelector((state) => state.session);
  // const reviewsObj = useSelector(state => state.review.reviews)
  // const reviews = reviewsObj && reviewsObj.reviews && Object.values(reviewsObj.reviews) || [];
  const reviews = Object.values(reviewsObj) || [];

  const [validationErrors, setValidationErrors] = useState([]);
  useEffect(() => {
    if (user)
      dispatch(getAllReviewsUser());
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) {
      setValidationErrors(["You must be logged in to see your reviews"]);
    } else if (reviews.length === 0) {
      setValidationErrors(["No reviews are here, make a review on a spot"]);
    } else {
      setValidationErrors([]);
    }
    // setValidationErrors(errors);
  }, [reviews.length, user]);

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
              <div>Spot Name: {review.Spot?.name || "N/A"}</div>
              <div>
                Address: {review.Spot?.address || "N/A"},{" "}
                {review.Spot?.city || "N/A"}, {review.Spot?.state || "N/A"}
              </div>
              <div className="user-review">{review.review}</div>
              <div className="user-review-stars">Stars: {review.stars}</div>
              <div className="user-review-createdAt">
                CreatedAt: {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default UserReviewsPage;
