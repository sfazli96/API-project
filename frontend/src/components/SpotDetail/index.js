import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// the json information for the get all spots
const SpotDetail = () => {
    const { id } = useParams()
    // select the spot from the entries based on the id 
    const spotDetail = useSelector(state => state.spot.entries[id])
    return (
        <div>
            <h1>{spotDetail.name}</h1>
            <p>{spotDetail.address}, {spotDetail?.city}, {spotDetail.state}, {spotDetail.country}</p>
            <p>{spotDetail.description}</p>
            <p>Price: ${spotDetail.price}</p>
            <img src={spotDetail.previewImage} alt={spotDetail.name} />
            <p>Average Rating: {spotDetail.avgRating}</p>
        </div>
    )
}

export default SpotDetail
