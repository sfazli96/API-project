import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotsActions from "../../store/spot"

function CreateSpotModal() {
    const dispatch = useDispatch()
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [errors, setErrors] = useState([])
    const { closeModal } = useModal()

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(spotsActions.createSpots({ address, city, state, country, name, description, price}))
            .then(closeModal)
            .catch(
                async (res) => {
                const data = await res.json()
                if (data && data.errors) setErrors(data.errors)
            }
        )
    }
    return (
        <>
            <h1 className="spotForm">Add a spot</h1>
            <form className="form" onSubmit={handleSubmit}>
                <ul>
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <label className="spot-label">
                Address
                <input type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </label>
            <label className="spot-label">
                City
                <input type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
            </label>
            <label className="spot-label">
                State
                <input type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
            </label>
            <label className="spot-label">
                Country
                <input type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
            </label>
            <label className="spot-label">
                Name
                <input type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            <label className="spot-label">
                Description
                <input type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </label>
            <label className="spot-label">
                Price
                <input type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </label>
            <button type="submit" className="submit-button">Create a Spot</button>
            </form>
        </>
    )
}

export default CreateSpotModal
