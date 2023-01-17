import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as spotActions from "../../store/spot"
import { Redirect } from "react-router-dom";


export const CreateSpotModal = () => {
    const dispatch = useDispatch()
    const spotUser = useSelector(state => state.spot.user)
    const [address, setAddress ] = useState('')
    const [city, setCity ] = useState('')
    const [state, setState ] = useState('')
    const [country, setCountry ] = useState('')
    const [name, setName ] = useState('')
    const [description, setDescription ] = useState('')
    const [price, setPrice ] = useState('')
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal()

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        return dispatch(spotActions.addSpot({address, city, state, country, name, description, price}))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json()
            if(data && data.errors) setErrors(data.errors)
        })
    }

    if (spotUser) return (
        <Redirect to="/" />
    )

    return (
        <form className="createSpotForm" onSubmit={handleSubmit}>
            <h1 className="h1">Add a Spot</h1>
            <ul className="ul">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label className="label">
        Address
        <input className="input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label className="label">
        City
        <input className="input"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>
      <label className="label">
        State
        <input className="input"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </label>
      <label className="label">
       Country
        <input className="input"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Name
        <input className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Description
        <input className="input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Price
        <input className="input"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <button className="Button" type="Create">Create</button>
        </form>
    )
}

export default CreateSpotModal
