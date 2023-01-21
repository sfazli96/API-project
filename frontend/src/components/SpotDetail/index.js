import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllReviews } from "../../store/review";
import { getOneSpot } from "../../store/spot";
import DeleteSpotModal from "../DeleteSpotModal";
import { EditSpotModal } from "../EditSpotModal";
import OpenModalButton from '../OpenModalButton'
import DeleteReviewModal from "../DeleteReviewModal"
import './spotDetail.css'
import CreateReviewForm from "../CreateReviewForm";

// the json information for the get all spots
const SpotDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    // select the spot from the entries based on the id
    const spotDetail = useSelector(state => state.spot.singleSpot)
    // select the review from the entries based on the id
    const reviewDetail = useSelector(state => state.review.allReviews)
     console.log('reviewDetail', reviewDetail)
    const reviews = Object.values(reviewDetail)
    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    useEffect(() => {
        if (spotDetail && spotDetail.id) {
            dispatch(getAllReviews(spotDetail.id))
        }
    }, [dispatch, spotDetail])

    if (!spotDetail || !spotDetail.name) {
        return <h1>Spot doesn't exist</h1>
    }

    if (!reviewDetail) {
        return <h1>Review doesn't exist</h1>
    }
    return (
        <div className="spot-detail-container">
            <h1 className="text-overlay">{spotDetail.name}</h1>
            <p className="text-overlay">{spotDetail.address}, {spotDetail.city}, {spotDetail.state}, {spotDetail.country}</p>
            <p className="text-overlay">{spotDetail.description}</p>
            <p className="spotDetail-price">Price: ${spotDetail.price}</p>
            {spotDetail.SpotImages.map(image => {
                return <img src={image.url} alt={spotDetail.name} className="spot-image" />

            })}
            <p className="spotDetail-rating">Average Rating: {spotDetail.avgStarRating}</p>
            <p className="num-reviews">numReviews: {spotDetail.numReviews}</p>
            <CreateReviewForm id={spotDetail.id}/>
            <h3 className="text-overlay">Reviews:</h3>
            <div className="reviews-container">
                {reviews.map((review, index) => {
                    return <div className="review" key={index}>
                        <p className="text-overlay">{review.review}</p>
                        <p className="text-overlay">{review.stars}</p>
                        <p className="text-overlay">{review.firstName}</p>
                    </div>
                })}
            </div>
            <OpenModalButton buttonText ="Edit a spot" modalComponent={<EditSpotModal/>}
            />

            <DeleteSpotModal />
            <DeleteReviewModal />

        </div>
    )

}

export default SpotDetail
