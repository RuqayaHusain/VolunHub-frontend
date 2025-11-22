import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { Star, Send, AlertCircle } from 'lucide-react';
import { UserContext } from '../../contexts/UserContext';
import styles from "./WriteReview.module.css";
import * as reviewService from '../../services/reviewService';

const MAX_CHARACTERS = 500;



const WriteReview = () => {
  const { eventId } = useParams();
  const { user } = useContext(UserContext);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const isVolunteer = user?.role === 'volunteer';
  const isOrganization = user?.role === 'organization';

 
  const canWrite = isVolunteer;                
  const canView = isVolunteer || isOrganization; 
  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
       const data = await reviewService.getReviewsByEvent(eventId);
        setReviews(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (eventId) fetchReviews();
  }, [eventId]);

  const handleSubmit = async () => {
    if (!newReview.comment.trim()) {
      setError('Please write a comment');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newReview,
          event: eventId,
        }),
      });
      
      await reviewService.createReview({
      ...newReview,
      event: eventId,
      });

const updatedReviews = await reviewService.getReviewsByEvent(eventId);
      setReviews(updatedReviews);
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 24) => {
    return (
      <div className={styles.starsWrapper}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = interactive 
            ? star <= (hoverRating || rating)
            : star <= rating;
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: star }))}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              disabled={!interactive}
              className={styles.starButton}
            >
              <Star
                size={size}
                className={`${styles.starIcon} ${isFilled ? styles.starFilled : styles.starEmpty}`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className={styles.writeReviewContainer}>

      {canWrite && (
        <div className={styles.reviewFormCard}>
          <h2 className={styles.reviewTitle}>Write a Review</h2>        
          {error && (
            <div className={styles.errorAlert}>
              <span className={styles.errorAlertIcon}>⚠️</span>
              {error}
            </div>
          )}

          <div className={styles.ratingSection}>
            <label className={styles.ratingLabel}>Your Rating</label>
            <div className={styles.ratingContainer}>
              {renderStars(newReview.rating, true, 32)}
              <span className={styles.ratingText}>
                {newReview.rating > 0 ? `${newReview.rating} / 5` : "Select a rating"}
              </span>
            </div>
          </div>

          <div className={styles.commentSection}>
            <label className={styles.commentLabel}>Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              className={styles.commentTextarea}
              rows={6}
              maxLength={MAX_CHARACTERS}
              placeholder="Share your experience…"
            />
            <div className={styles.characterCount}>
              {newReview.comment.length}/{MAX_CHARACTERS}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !newReview.comment.trim()}
            className={styles.submitButton}
          >
            {submitting ? (
              <>
                <div className={styles.buttonSpinner}></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Review
              </>
            )}
          </button>
        </div>
      )}

       
      {canView ? (
        <div className={styles.reviewsListCard}>
          <div className={styles.reviewsHeader}>
            <h3 className={styles.reviewsListTitle}>All Reviews</h3>
            {reviews.length > 0 && (
              <div className={styles.reviewsSummary}>
                {renderStars(Math.round(averageRating), false, 20)}
                <span className={styles.averageRating}>{averageRating}</span>
                <span className={styles.reviewCount}>
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </div>

        {reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <Star size={48} className={styles.emptyStateIcon} />
            <p className={styles.emptyStateText}>No reviews yet</p>
            <p className={styles.emptyStateSubtext}>
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewItem}>
                <div className={styles.reviewContent}>
                  <img
                    src={review.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&size=48&background=random`}
                    alt={review.user?.name}
                    className={styles.reviewAvatar}
                  />
                  
                  <div className={styles.reviewDetails}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewUserInfo}>
                        <h4 className={styles.reviewUsername}>
                          {review.user?.name}
                        </h4>
                        <div className={styles.reviewMeta}>
                          {renderStars(review.rating, false, 18)}
                          <span className={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={styles.reviewComment}>
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      ) : (
       
        <div className={styles.warningAlert}>
          <AlertCircle size={20} />
          <div>
            <p className={styles.warningAlertTitle}>Access Restricted</p>
            <p className={styles.warningAlertText}>You don’t have permission to view reviews.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default WriteReview;