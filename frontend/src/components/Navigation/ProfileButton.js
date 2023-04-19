import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './profileButton.css'
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ulRef = useRef();
  const history = useHistory()
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };
  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };
  const handleClick = () => {
    history.push("/myReviews");
  };

  const handleClickSpotPage = () =>{
    history.push("/mySpots")
  }

  const handleClickBookings = () => {
    history.push("/myBookings")
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
    <div className="Navbar">
      <button className= "button-dropdown" onClick={() => setShowMenu(!showMenu)}>
        <i className="fas fa-user-circle" />
      </button>
    </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={handleClickSpotPage} className='user-spot-button'>My Spots</button>
            </li>
            <li>
              <button onClick={handleClick} className='user-review-button'>My Reviews</button>
            </li>
            {/* <li>
              <button onClick={handleClickBookings} className="user-booking-button">My Bookings</button>
            </li> */}
            <li>
              <button class="logout" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText={<div className="text-login">Log In</div>}
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText={<div className="text-signup">Sign Up</div>}
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
