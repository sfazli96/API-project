import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllReviews } from "../../store/review";
import { getOneSpot } from "../../store/spot";
import DeleteSpotModal from "../DeleteSpotModal";
import { EditSpotModal } from "../EditSpotModal";
import OpenModalButton from '../OpenModalButton'
import CreateReviewSpotModal from "../CreateReviewSpotModal";
import DeleteReviewModal from "../DeleteReviewModal"
import './spotDetail.css'

// the json information for the get all spots
const SpotDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    // select the spot from the entries based on the id
    const spotDetail = useSelector(state => state.spot.singleSpot)
    // select the review from the entries based on the id
    const reviewDetail = useSelector(state => state.review.allReviews)
    // console.log('reviewDetail', reviewDetail)
    const reviews = Object.values(reviewDetail)
    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    useEffect(() => {
        dispatch(getAllReviews(id))
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
            <h3>Reviews: {reviews.map(review => {
                if (reviews) {
                    return <ul className="rev">{review.review}</ul>
                }
            })}</h3>
            <OpenModalButton buttonText ="Edit a spot" modalComponent={<EditSpotModal/>}
            />
            <OpenModalButton buttonText="Add a review" modalComponent={<CreateReviewSpotModal/>} />
            <DeleteSpotModal />
            <DeleteReviewModal />

        </div>
    )
}

export default SpotDetail
