import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import CreateSpotModal from '../CreateSpotModal';
import OpenModalMenuItem from './OpenModalMenuItem';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      <OpenModalMenuItem
      buttonText="Add a spot"
      modalComponent={<CreateSpotModal></CreateSpotModal>}
      ></OpenModalMenuItem>
    </ul>
  );
}

export default Navigation;
