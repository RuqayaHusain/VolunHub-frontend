import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
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
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [hover, setHover] = useState(0); // لتلوين النجوم عند المرور بالماوس
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isVolunteer = user?.role === 'volunteer';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/reviews/event/${eventId}`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchReviews();
  }, [eventId]);

  const handleSubmit = async () => {
    if (!newReview.comment.trim() || newReview.rating === 0)
      return setError('Please select a rating and write a comment');

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

      setNewReview({ rating: 0, comment: '' });
      setHover(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: star }))}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className="focus:outline-none"
        >
          <Star
            size={32}
            className={`transition-colors ${
              star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (!isVolunteer) {
    return <p className="text-red-600">Only volunteers can write reviews.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Rating</label>
        {renderStars(newReview.rating, true)}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Comment</label>
        <textarea
          rows={5}
          value={newReview.comment}
          onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
          className="w-full border rounded p-2"
          placeholder="Share your experience..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !newReview.comment.trim() || newReview.rating === 0}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Previous Reviews</h3>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map(r => (
            <div key={r._id} className="mb-4 p-3 border rounded">
              <div className="flex items-center gap-2 mb-1">
                {renderStars(r.rating)}
                <span className="text-sm text-gray-500">{r.user?.name}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WriteReview;
