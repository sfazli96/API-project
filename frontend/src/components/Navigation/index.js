import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotModal from '../CreateSpotModal'
import './Navigation.css';
import { Toggle } from 'react-hook-theme';
import 'react-hook-theme/dist/styles/style.css';
import { useState } from 'react';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const spotObj = useSelector(state => state.spot.allSpots)
  // console.log('spots', spotObj)
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState("");

  let filteredSpots = []

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
 const handleSearch = (e) => {
      e.preventDefault();
      filteredSpots = Object.values(spotObj).filter(spot =>
        spot.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      history.push(`/search?query=${searchTerm}`);
      setSearchTerm('');
    };
  return (
    <div className="NavBar">
      <NavLink to="/">
        <h2>airSFRents</h2>
      </NavLink>
    <li>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className='search-input'
          placeholder="Search by city or state"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className='submit-search-button'>Search</button>
      </form>
    </li>
    <div className='add-spot-div'>
    <Toggle className='toggle-button'/>
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
