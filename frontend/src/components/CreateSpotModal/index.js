import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as spotActions from "../../store/spot"
import './createSpotModal.css'
import { useSelector } from "react-redux";


export const CreateSpotModal = () => {
    const dispatch = useDispatch()
    const [address, setAddress ] = useState('')
    const [city, setCity ] = useState('')
    const [state, setState ] = useState('')
    const [country, setCountry ] = useState('')
    const [name, setName ] = useState('')
    const [description, setDescription ] = useState('')
    const [price, setPrice ] = useState('')
    const [previewImage, setImage] = useState('')
    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector(state => state.session.user);
    const { closeModal } = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        if (!sessionUser) {
          setErrors(errors => [...errors, 'User must be signed in to create a spot'])
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
        if (previewImage.length === 0) {
          setErrors(errors => [...errors, 'Please include a image url'])
          return
        }
        try {
          // const imageUrl = new URL(previewImage)
          // if (imageUrl.protocol !== 'http:' && imageUrl.protocol !== 'https:') {
          //   setErrors(errors => [...errors, 'Please enter a valid image link (http/https protocol)']);
          //   return;
          // }
          const response = await fetch(previewImage, { method: 'HEAD' });
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.startsWith('image/')) {
              setErrors(errors => [...errors, 'Please enter a valid image link']);
              return;
          }
        } catch (error) {
          setErrors(errors => [...errors, 'Please enter a valid image link']);
          return;
      }
        return dispatch(spotActions.addSpot({address, city, state, country, name, description, price, previewImage, lat:10, lng:10}, previewImage))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json()
            if(data && data.errors) setErrors(data.errors)
        })

    }
    return (
        <form className="add-spot-modal" onSubmit={handleSubmit}>
            <h1 className="h1">Add a Spot</h1>
            {/* <ul className="ul">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul> */}
       <ul className="error-message">
        {errors.map((error, idx) => (
          <li key={idx} className="error-text">
            {error}
          </li>
        ))}
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
        {/* <input className="input"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /> */}
        <input
          type="number"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          max="9999"
        />

      </label>
      <label className="form-label3">
        Add an Image
        <input className="file"
          type="text"
          onChange={(e) => setImage(e.target.value)}
          required
        />
      </label>
      <button className="Button" type="Create">Create</button>
    </form>
    )
}

export default CreateSpotModal
