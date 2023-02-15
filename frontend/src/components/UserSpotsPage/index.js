import React, { useEffect, useState } from 'react';
import { getAllSpotUser } from '../../store/spot';
import { useDispatch, useSelector } from 'react-redux';
import './userSpotsPage.css';
import { Link } from 'react-router-dom';

const UserSpotsPage = () => {
  const dispatch = useDispatch();
  const userSpecificSpots = useSelector((state) => state.spot.userSpecificSpots);
  const spots = userSpecificSpots ? Object.values(userSpecificSpots) : [];
  const user = useSelector((state) => state.session.user);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(getAllSpotUser());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="spot-logged-error">
        <p>You must be logged in to see your spots!</p>
      </div>
    );
  }

  if (spots.length === 0) {
    return (
      <div className="spot-logged-error">
        <p>No spots here, make a spot!</p>
      </div>
    );
  }

  return (
    <div className="my-spot-container">
      <h1 className='my-spot-title'>My Spots</h1>
      {validationErrors.length > 0 && (
        <div>
          {validationErrors.map((error) => (
            <div key={error}>
              <p>{error}</p>
            </div>
          ))}
        </div>
      )}
      {validationErrors.length === 0 && (
        <ul className="my-spot-list">
          {spots.map((spot) => (
            <li key={spot.id} className="my-spot-card">
              <Link to={`/spots/${spot.id}`} className="my-spot-link">
                <div className="my-spot-name">{spot.name}</div>
                <p className="my-spot-description">{spot.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSpotsPage;
