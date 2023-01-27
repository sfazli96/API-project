import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "./editSpotModal.css"
import * as spotActions from "../../store/spot"


export const EditSpotModal = () => {
    const dispatch = useDispatch()
    const spotsObj = useSelector(state => state.spot.singleSpot)
    // console.log('spotsObj', spotsObj)
    const id = spotsObj.id
    const [address, setAddress ] = useState(spotsObj.address)
    const [city, setCity ] = useState(spotsObj.city)
    const [state, setState ] = useState(spotsObj.state)
    const [country, setCountry ] = useState(spotsObj.country)
    const [name, setName ] = useState(spotsObj.name)
    const [description, setDescription ] = useState(spotsObj.description)
    const [price, setPrice ] = useState(spotsObj.price)
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal()
    const sessionUser = useSelector(state => state.session.user);


    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        if (!sessionUser) {
          setErrors(errors => [...errors, 'User must be signed in to edit a spot'])
          return
        }
        if (address.length === 0 || address.length > 25) {
          setErrors(errors => [...errors, 'Please enter a valid street address (less than 25 characters)'])
          return
        }
        if (city.length === 0 || city.length > 20) {
          setErrors(errors => [...errors, 'Please enter a valid city name (less than 20 characters)'])
          return
        }
        if (state.length === 0 || state.length > 20) {
          setErrors(errors => [...errors, 'Please enter a valid state name (less than 20 characters)'])
          return
        }
        if (country.length === 0 || country.length > 25) {
          setErrors(errors => [...errors, 'Please enter a valid country name (less than 25 characters)'])
          return
        }
        if (name.length === 0 || name.length > 20) {
          setErrors(errors => [...errors, 'Please enter a valid name (less than 20 characters)'])
          return
        }
        if (description.length === 0 || description.length > 100) {
          setErrors(errors => [...errors, 'Please enter a valid description (less than 100 characters)'])
          return
        }
        if (price <= 0 || !price) {
          setErrors(errors => [...errors, 'Please enter a valid price (must be a positive number)'])
          return
        }
        if (!Number(price)) {
          setErrors(errors => [...errors, 'Price must be a number'])
          return
        }
        return dispatch(spotActions.editSpots({id, address, city, state, country, name, description, price, lat:10, lng:10}))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json()
            if(data && data.errors) setErrors(data.errors)
        })
    }
    return (
        <form className="edit-modal" onSubmit={handleSubmit}>
            <h1 className="h1">Edit a Spot</h1>
            <ul className="ul">
              {Array.isArray(errors) && errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
      <label className="form-label3">
        Address
        <input className="input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label className="form-label3">
        City
        <input className="input"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>
      <label className="form-label3">
        State
        <input className="input"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </label>
      <label className="form-label3">
       Country
        <input className="input"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </label>
      <label className="form-label3">
        Name
        <input className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="form-label3">
        Description
        <input className="input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label className="form-label3">
        Price
        <input className="input"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <button className="Button" type="Create">Edit</button>
    </form>
    )
}

export default EditSpotModal
