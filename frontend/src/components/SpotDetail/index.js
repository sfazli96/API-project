import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllReviews } from "../../store/review";
import { getOneSpot } from "../../store/spot";
import DeleteSpotModal from "../DeleteSpotModal";
import { EditSpotModal } from "../EditSpotModal";
import OpenModalButton from '../OpenModalButton'
import './spotDetail.css'
import CreateReviewForm from "../CreateReviewForm";
import * as reviewActions from "../../store/review";

// the json information for the get all spots
const SpotDetail = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    // select the spot from the entries based on the id

    const spotDetail = useSelector(state => state.spot.singleSpot)
    console.log('spotDetail', spotDetail)
    // select the review from the entries based on the id
    const reviewDetail = useSelector(state => state.review.allReviews)
    const reviews = Object.values(reviewDetail)
    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

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
    let totalRating=0;
    reviews?.forEach(review=> {
        totalRating += parseInt(review.stars);
    })

    const handleDelete = (reviewId) => {
        // e.preventDefault();
        // setErrors([]);
        // const reviewId = review.id
        return dispatch(reviewActions.deleteReview(reviewId))
          .then((res) => {
            dispatch(getAllReviews(spotDetail.id))

          })
          .catch((err) => {
              console.log("An error occurred while deleting the spot. Please try again later.", err);
          })
      };


    return (
        <div className="spot-detail-container">
            <h1 className="text-overlay">{spotDetail.name}</h1>
            <p className="text-overlay">{spotDetail.address}, {spotDetail.city}, {spotDetail.state}, {spotDetail.country}</p>
            <p className="text-overlay">{spotDetail.description}</p>
            <p className="spotDetail-price">Price: ${spotDetail.price}</p>
            {spotDetail.SpotImages.map((image, index) => {
                return <img src={image.url} alt={spotDetail.name} className="spot-image" key={index}/>

            })}
            <p className="spotDetail-rating">Average Rating: {reviews.length < 2 ? totalRating : totalRating/2}</p>
            <p className="num-reviews">numReviews: {reviews.length}</p>
            <CreateReviewForm />
            <h3 className="text-overlay">Reviews:</h3>
            <div className="reviews-container">
                {reviews.map((review, index) => {
                    return <div className="review" key={index}>
                        <p className="text-overlay">{review.review}</p>
                        <p className="text-overlay">{review.stars}</p>
                        <p className="text-overlay">{review?.User?.firstName} {review?.User?.lastName}</p>
                        <button className="Button" onClick={() => handleDelete(review.id)}>
                            Delete Review
                        </button>
                    </div>
                })}
            </div>
            <OpenModalButton buttonText ="Edit a spot" modalComponent={<EditSpotModal/>}
            />

            <DeleteSpotModal />


        </div>
    )

}

export default SpotDetail
