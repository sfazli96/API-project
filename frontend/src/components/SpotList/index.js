import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Route, Switch } from "react-router-dom"
import { getSpots } from "../../store/spot"
import SpotDetail from "../SpotDetail"
import "./spotList.css"

const SpotList = () => {
    // gain access to dispatch function, used to dispatch the "getSpots" action to store
    const dispatch = useDispatch()
    // useSelector is used to access the entries property of the spot of the redux store
    // Object.values converts the object to an array
    const spotObj = useSelector(state => state.spot.allSpots)
    const spots = Object.values(spotObj)
    // this useEffect gets called the "getSpots"  action when the component is 1st rendered.
    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch]) // this makes sure the effect runs only on 1st render

    return (
        <div className="cards-div">
                {spots.map(({ id, name, previewImage, city, state, price, avgRating }) => {
                    let rating = Math.round(Number(avgRating) * 1000) / 1000;
                    if (isNaN(rating)) {
                        rating = 0
                    }
                    return (
                    <div key={id} className="li2">
                        <div className="spot-container">
                            <NavLink to= {`/spots/${id}`} className="spot-nav-link">
                                <div className="image-text-container">
                                    <img src={previewImage} alt={name} className="img"/>
                                    <div className="city-rating-div">
                                        <p className="text">{city}, {state}</p>
                                        <p className="reviews">{avgRating}</p>
                                    </div>
                                    <p className="price">${price} night</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    )
                })}

            <Switch>
                <Route path='/spots/:id'>
                    <SpotDetail spots={spots} />
                </Route>
            </Switch>
        </div>
    )
}

export default SpotList
