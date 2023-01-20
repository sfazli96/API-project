import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spot";
import DeleteSpotModal from "../DeleteSpotModal";
import { EditSpotModal } from "../EditSpotModal";
import OpenModalButton from '../OpenModalButton'
import './spotDetail.css'

// the json information for the get all spots
const SpotDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    // select the spot from the entries based on the id
    const spotDetail = useSelector(state => state.spot.singleSpot)
    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    if (!spotDetail || !spotDetail.name) {
        return <h1>Spot doesn't exist</h1>
    }
    return (
        <div className="spot-detail-container">
            <h1>{spotDetail.name}</h1>
            <p>{spotDetail.address}, {spotDetail.city}, {spotDetail.state}, {spotDetail.country}</p>
            <p>{spotDetail.description}</p>
            <p>Price: ${spotDetail.price}</p>
            {spotDetail.SpotImages.map(image => {
                return <img src={image.url} alt={spotDetail.name} />

            })}
            <p>Average Rating: {spotDetail.avgRating}</p>
            <OpenModalButton buttonText ="Edit a spot" modalComponent={<EditSpotModal/>}
            />
            <DeleteSpotModal />
        </div>
    )
}

export default SpotDetail
