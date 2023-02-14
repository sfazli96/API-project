import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotModal from '../CreateSpotModal'
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory()

  // const handleClick = () => {
  //   history.push("/reviews/current");
  // };

  // const handleClickSpotPage = () =>{
  //   history.push("/spots/current")
  // }
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
        {/* <button onClick={logout}>Log Out</button> */}
      </li>
    );
  } else {
    sessionLinks = (
      <li>
    <OpenModalButton
    className="ModalButton"
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
    <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <div className="NavBar">
      <NavLink to="/">
        <h2>airSFRents</h2>
      </NavLink>
    <div className='add-spot-div'>
        {/* <button onClick={handleClickSpotPage} className='user-spot-button'>My Spots</button> */}
        {/* <button onClick={handleClick} className='user-review-button'>My Reviews</button> */}
      <li className='add-spot-button'>
      <OpenModalButton
      buttonText={<div id='spot-button'>Add a Spot</div>}
      modalComponent={<CreateSpotModal />}
      />
      </li>
      {isLoaded && (
        <li>

          <ProfileButton user={sessionUser} />
        </li>
      )}
      </div>
      </div>
  );
}

export default Navigation;
