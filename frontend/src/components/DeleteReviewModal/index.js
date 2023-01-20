import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from "../../store/review";
import { useHistory } from "react-router-dom";

export const DeleteSpotModal = () => {
  const dispatch = useDispatch();
  const review = useSelector(state => state.review.reviews)
  const id = review.id
  const { closeModal } = useModal();
  const [errors, setErrors] = useState([]);
//   const history = useHistory()

  const handleSubmit = (e) => {
    // e.preventDefault();
    setErrors([]);
    return dispatch(reviewActions.deleteReview({id}))
      .then((res) => {
        if(res.status === 200){
          closeModal();
          // history.push('/');
        }
      })
      .catch(async (res) => {
        if (!res.ok) {
          setErrors(["An error occurred while deleting the spot. Please try again later."]);
        }
      })
      // .then(()=>{
      //   history.push('/');
      // });
  };


  return (
    <form className="deleteReviewForm" onSubmit={handleSubmit}>
      <ul className="ul">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <button className="Button" onClick={() => handleSubmit()}>
        Delete Review
      </button>
    </form>
  );
};

export default DeleteSpotModal;
