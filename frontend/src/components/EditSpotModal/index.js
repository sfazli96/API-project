import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as spotActions from "../../store/spot"


export const EditSpotModal = () => {
    const dispatch = useDispatch()
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

        return dispatch(spotActions.editSpots({address, city, state, country, name, description, price, lat:10, lng:10}))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json()
            if(data && data.errors) setErrors(data.errors)
        })
    }
    return (
        <form className="createSpotForm" onSubmit={handleSubmit}>
            <h1 className="h1">Edit a Spot</h1>
            <ul className="ul">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
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
