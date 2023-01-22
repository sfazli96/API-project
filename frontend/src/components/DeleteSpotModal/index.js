import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spot";
import { useHistory } from "react-router-dom";

export const DeleteSpotModal = (props) => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spot.singleSpot)
  const id = spots.id
  const { closeModal } = useModal();
  const [errors, setErrors] = useState([]);
  const history = useHistory()

  const handleSubmit = () => {

    setErrors([]);
    return dispatch(spotActions.deleteSpots({id}))
      .then((res) => {
        history.push('/');
      })
      .catch(async (res) => {
        if (!res.ok) {
          setErrors(["An error occurred while deleting the spot. Please try again later."]);
        }
      })
  };
  if (!spotActions.deleteSpots) return null

  return (
      <button className="Button" onClick={handleSubmit}>
        Delete
      </button>
  );
};

export default DeleteSpotModal;
