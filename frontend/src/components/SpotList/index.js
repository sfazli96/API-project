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
        <div>
            <ol>
                {spots.map(({ id, name, previewImage, city, state, price, avgRating }) => {
                    return (
                    <ol key={id} className="li2">
                        <div className="spot-container">
                            <NavLink to= {`/spots/${id}`}>
                                <img src={previewImage} alt={name} className="img"/>
                            </NavLink>
                                <p>{city}, {state}</p>
                                <p>${price}</p>
                                <p>{avgRating}</p>
                        </div>
                    </ol>
                    )
                })}
            </ol>

            <Switch>
                <Route path='/spots/:id'>
                    <SpotDetail spots={spots} />
                </Route>
            </Switch>
        </div>
    )
}

export default SpotList
