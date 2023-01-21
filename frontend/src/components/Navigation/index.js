import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotModal from '../CreateSpotModal'
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

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

    <ol>
      {/* <li>
        <NavLink exact to="/">Home</NavLink>
      </li> */}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      <li>
      <OpenModalButton
      buttonText="Add a Spot"
      modalComponent={<CreateSpotModal />}
      />
      </li>
      <NavLink to="/">
        <h2>airSFRents</h2>
      </NavLink>
      {/* <i class="fa-thin fa-apartment"></i> */}
    </ol>
      </div>
  );
}

export default Navigation;
