import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, AlertCircle } from 'lucide-react';
import { UserContext } from '../../contexts/UserContext';

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
  const navigate = useNavigate();

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
      
      // Refresh reviews
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
      <div className="flex gap-1">
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
              className={`transition-all ${
                interactive 
                  ? 'cursor-pointer hover:scale-110 transform' 
                  : 'cursor-default'
              }`}
            >
              <Star
                size={size}
                className={`${
                  isFilled 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                } transition-colors`}
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

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (!isVolunteer) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold">Access Restricted</p>
            <p className="text-sm mt-1">Only volunteers can write reviews for events.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Write Review Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Write a Review</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Rating Section */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Your Rating
          </label>
          <div className="flex items-center gap-4">
            {renderStars(newReview.rating, true, 40)}
            <span className="text-2xl font-bold text-gray-700">
              {ratingLabels[hoverRating || newReview.rating]}
            </span>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Share Your Experience
          </label>
          <textarea
            rows={6}
            value={newReview.comment}
            onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tell us about your experience with this event. What did you enjoy? What could be improved?"
          />
          <p className="mt-2 text-sm text-gray-500">
            {newReview.comment.length} characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !newReview.comment.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">All Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(Math.round(averageRating), false, 20)}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {averageRating}
              </span>
              <span className="text-sm text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <Star size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <img
                    src={review.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&size=48&background=random`}
                    alt={review.user?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {review.user?.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          {renderStars(review.rating, false, 18)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-3">
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