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
import Bookings from "../Bookings";

// the json information for the get all spots
const SpotDetail = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    // select the spot from the entries based on the id

    const spotDetail = useSelector(state => state.spot.singleSpot)
    const user = useSelector(state => state.session.user)
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
    const avgRating = reviews.length < 2 ? totalRating : (totalRating/reviews.length).toFixed(1);

    const handleDelete = (reviewId) => {
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
            <div className="rating-model-div">
                <div className="rating-div">
                <p className="spotDetail-rating">{avgRating}</p>
                <div className="num-review-container">
                    <p className="num-reviews">{reviews.length} reviews</p>
                </div>
                </div>
                <div className="delete-model-div">
                    {user?.id === spotDetail?.ownerId &&<OpenModalButton buttonText ={<div id="edit-spot-modal-detail">Edit a spot</div>} modalComponent={<EditSpotModal/>}/>}
                    {user?.id === spotDetail?.ownerId &&<DeleteSpotModal />}
                </div>
            </div>

            {spotDetail.SpotImages.map((image, index) => {
                return <img src={image.url} alt={spotDetail.name} className="spot-image" key={index}/>

            })}
            <p className="text-overlay-description">{spotDetail.description}</p>
            <p className="spotDetail-price">${spotDetail.price} night</p>

            {/* User can make a review ONLY on other spots they didn't create but should not leave a review on there spot */}
            {/* Also when user NOT logged in only show all reviews */}
            {user && user.id !== spotDetail?.ownerId && <CreateReviewForm />}
                {/* <Bookings /> */}
            <div className="reviews-container">

                {/* <h3 className="text-overlay-reviews">Reviews:</h3> */}
                {/* <p className="num-reviews">{reviews.length} reviews</p> */}
                {reviews.reverse()
                .map((review, index) => {
                    return <div className="review-card" key={index}>
                        <p className="review-user">{review?.User?.firstName}</p>
                        <p className="review-text">{review.review}</p>
                        <p className="review-rating">{review.stars}</p>
                        {/* <p className="rating-createdAt">CreatedAt: {new Date(review.createdAt).toLocaleDateString()}</p>
                        <p className="rating-updatedAt">UpdatedAt: {new Date(review.updatedAt).toLocaleDateString()}</p> */}
                        {user?.id === review.userId ? <div className="trashcan" onClick={() => handleDelete(review.id)}><i className="fas fa-trash-alt"></i></div> : null}
                    </div>
                })}
            </div>
        </div>
    )

}

export default SpotDetail
