import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './search.css';

function Search() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('query');
  const spotObj = useSelector(state => state.spot.allSpots)
  const [filteredSpots, setFilteredSpots] = useState([])
  useEffect(() => {
    if (query) {
      const filtered = Object.values(spotObj).filter(
        (spot) => spot.city.toLowerCase().includes(query.toLowerCase()) ||
                   spot.state.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSpots(filtered);
    }
  }, [spotObj, query]);


  return (
    <div className='search-root-container'>
      <h1>Search Results</h1>
      {filteredSpots.length > 0 ? (
        <ul className='filter-spots'>
          {filteredSpots.map(spot => (
            <NavLink className='filtered-spots-link' key={spot.id} to={`/spots/${spot.id}`}>
              {/* <li>{spot.name}</li>
              <li>${spot.price}</li> */}
              <img src={spot.previewImage}></img>
            </NavLink>
          ))}
        </ul>
      ) : (
        <p>No results found for "{query}"</p>
      )}
    </div>
  );
}

export default Search;
