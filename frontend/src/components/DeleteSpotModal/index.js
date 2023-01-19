import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import * as spotActions from "../../store/spot";

export const DeleteSpotModal = ({ spot }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(spotActions.deleteSpots(spot))
      .then(() => {
        closeModal();
      })
      .catch(async (res) => {
        if (!res.ok) {
          setErrors(["An error occurred while deleting the spot. Please try again later."]);
        }
      });
  };

  return (
    <form className="deleteSpotForm" onSubmit={handleSubmit}>
      <h1 className="h1">Delete a Spot</h1>
      <ul className="ul">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <p>Are you sure you want to delete this spot?</p>
      <button className="Button" type="Delete">
        Delete
      </button>
    </form>
  );
};

export default DeleteSpotModal;
