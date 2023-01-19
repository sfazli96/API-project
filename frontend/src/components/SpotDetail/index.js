import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spot";
import { EditSpotModal } from "../EditSpotModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

// the json information for the get all spots
const SpotDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    // select the spot from the entries based on the id
    const spotDetail = useSelector(state => state.spot[id])
    // const spotDetail = useSelector(state => state.singleSpot || {})
    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])
    if (!spotDetail) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h1>{spotDetail.name}</h1>
            <p>{spotDetail.address}, {spotDetail.city}, {spotDetail.state}, {spotDetail.country}</p>
            <p>{spotDetail.description}</p>
            <p>Price: ${spotDetail.price}</p>
            <img src={spotDetail.previewImage} alt={spotDetail.name} />
            <p>Average Rating: {spotDetail.avgRating}</p>
            <button>
            <OpenModalMenuItem buttonText ="Edit a spot" modalComponent={<EditSpotModal />}
            /> Edit 
            </button>
        </div>
    )
}

export default SpotDetail
