import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spot";
import { useHistory } from "react-router-dom";

export const DeleteSpotModal = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spot.singleSpot)
  const id = spots.id
  const { closeModal } = useModal();
  const [errors, setErrors] = useState([]);
  const history = useHistory()

  const handleSubmit = (e) => {
    // e.preventDefault();
    setErrors([]);
    return dispatch(spotActions.deleteSpots({id}))
      .then((res) => {
        if(res.status === 200){
          closeModal();
        }
        history.push('/');
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
  if (!spotActions.deleteSpots) return null

  return (
    <form className="deleteSpotForm" onSubmit={handleSubmit}>
      <ul className="ul">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <button className="Button" onClick={() => handleSubmit()}>
        Delete
      </button>
    </form>
  );
};

export default DeleteSpotModal;
