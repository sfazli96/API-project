import React, { useEffect, useState } from 'react';
import { getAllSpotUser } from '../../store/spot';
import { useDispatch, useSelector } from 'react-redux';

const UserSpotsPage = () => {
  const dispatch = useDispatch();
  const userSpecificSpots = useSelector(state => state.spot.userSpecificSpots);
  console.log(userSpecificSpots, 'USER')
  const user = useSelector(state => state.session.user);
  const spots = Object.values(userSpecificSpots);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
      dispatch(getAllSpotUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      setValidationErrors(["You must be logged in to see your spots"]);
    } else if (spots.length === 0) {
      setValidationErrors(["No spots here, make a spot"]);
    } else {
      setValidationErrors([]);
    }
  }, [spots.length, user]);

  return (
    <div>
      <h1>My Spots</h1>
      {validationErrors.map(error => (
        <div key={error}>
          <p>{error}</p>
        </div>
      ))}
      {spots.map(spot => {
        <div key={spot.id}>
          <h2>{spot.name}</h2>
          <p>{spot.description}</p>
        </div>
          console.log(spot, 'SPOTS')
    })}
    </div>
  );
};

export default UserSpotsPage;
