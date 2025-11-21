import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Send, AlertCircle } from 'lucide-react';
import { UserContext } from '../../contexts/UserContext';
import styles from "./WriteReview.module.css";

const API_BASE_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const WriteReview = () => {
  const { eventId } = useParams();
  const { user } = useContext(UserContext);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const isVolunteer = user?.role === 'volunteer';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews/event/${eventId}`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
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
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }
      
      const updatedRes = await fetch(`${API_BASE_URL}/reviews/event/${eventId}`, {
        headers: getAuthHeaders(),
      });
      const updatedReviews = await updatedRes.json();
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
      <div className="stars-wrapper">
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
              className="star-button"
            >
              <Star
                size={size}
                className={`star-icon ${isFilled ? 'star-filled' : 'star-empty'}`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (!isVolunteer) {
    return (
      <div className={styles.writeReviewContainer}
>
        <div className="warning-alert">
          <AlertCircle className="error-alert-icon" size={20} />
          <div>
            <p className="warning-alert-title">Access Restricted</p>
            <p className="warning-alert-text">Only volunteers can write reviews for events.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.writeReviewContainer}
>
      <div className={styles.reviewFormCard}

>
    <h2 className={styles.reviewTitle}>Write a Review </h2>        
        {error && (
        <div className={styles.errorAlert}>
        <span className={styles.errorAlertIcon}>⚠️</span>
        {error}
        </div>
        )}

        <div className="rating-section">
          <label className="rating-label">Your Rating</label>
          <div className="rating-container">
            {renderStars(newReview.rating, true, 40)}
            <span className="rating-text">
              {ratingLabels[hoverRating || newReview.rating]}
            </span>
          </div>
        </div>

        <div className="comment-section">
          <label className="comment-label">Share Your Experience</label>
          <textarea
            rows={6}
            value={newReview.comment}
            onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="comment-textarea"
            placeholder="Tell us about your experience with this event. What did you enjoy? What could be improved?"
          />
          <p className="character-count">
            {newReview.comment.length} characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !newReview.comment.trim()}
          className="submit-button"
        >
          {submitting ? (
            <>
              <div className="button-spinner"></div>
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

      {/* Reviews List Section */}
      <div className="reviews-list-card">
        <div className="reviews-header">
          <h3 className="reviews-list-title">All Reviews</h3>
          {reviews.length > 0 && (
            <div className="reviews-summary">
              {renderStars(Math.round(averageRating), false, 20)}
              <span className="average-rating">{averageRating}</span>
              <span className="review-count">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <Star size={48} className="empty-state-icon" />
            <p className="empty-state-text">No reviews yet</p>
            <p className="empty-state-subtext">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-content">
                  <img
                    src={review.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&size=48&background=random`}
                    alt={review.user?.name}
                    className="review-avatar"
                  />
                  
                  <div className="review-details">
                    <div className="review-header">
                      <div className="review-user-info">
                        <h4 className="review-username">
                          {review.user?.name}
                        </h4>
                        <div className="review-meta">
                          {renderStars(review.rating, false, 18)}
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="review-comment">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteReview;