import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Route, Switch } from "react-router-dom"
import { getSpots } from "../../store/spot"
import SpotDetail from "../SpotDetail"

const SpotList = () => {
    // gain access to dispatch function, used to dispatch the "getSpots" action to store
    const dispatch = useDispatch()
    // useSelector is used to access the entries property of the spot of the redux store
    // Object.values converts the object to an array
    const spots = Object.values(useSelector(state => state.spot))

    // this useEffect gets called the "getSpots"  action when the component is 1st rendered.
    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch]) // this makes sure the effect runs only on 1st render
    return (
        <div>
            <h1>Spot List</h1>
            <ol>
                {spots.map(({ id, name }) => {
                    return (
                    <li key={id}>
                        <NavLink to={`/spots/${id}`}>{name}</NavLink>
                    </li>
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
