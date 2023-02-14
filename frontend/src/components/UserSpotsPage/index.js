import React, { useEffect, useState } from 'react';
import { getAllSpotUser } from '../../store/spot';
import { useDispatch, useSelector } from 'react-redux';
import "./userSpotsPage.css"
const UserSpotsPage = () => {
  const dispatch = useDispatch();
  const userSpecificSpots = useSelector(state => state.spot.userSpecificSpots);
  // const spots = Object.values(userSpecificSpots);
  const spots = userSpecificSpots ? Object.values(userSpecificSpots) : [];
  console.log('SPOTS', spots)
  const user = useSelector(state => state.session.user);
  const reviewDetail = useSelector(state => state.review.allReviews)
  const reviews = Object.values(reviewDetail)
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(getAllSpotUser());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className='spot-logged-error'>
        <p>You must be logged in to see your spots!</p>
      </div>
    );
  }

  if (spots.length === 0) {
    return (
      <div className='spot-logged-error'>
        <p>No spots here, make a spot!</p>
      </div>
    );
  }

  return (
    <div className='my-spot-container'>
      <h1>My Spots</h1>
      {validationErrors.length > 0 && (
        <div>
          {validationErrors.map(error => (
            <div key={error}>
              <p>{error}</p>
            </div>
          ))}
        </div>
      )}
      {validationErrors.length === 0 && spots.map(spot => (
        <div key={spot.id}>
          <li>
            <h4 className='my-spot-container'>{spot.name}</h4>
            <p>{spot.description}</p>
          </li>
        </div>

      ))}
    </div>
  );

};

export default UserSpotsPage;
