import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
    if (!newReview.comment.trim()) return setError('Please write a comment');
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newReview,
          event: eventId, // تأكد من اسم الحقل في الباك
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }
      // إعادة جلب الريفيوز بعد الإرسال
      const updatedRes = await fetch(`${API_BASE_URL}/reviews/event/${eventId}`, {
        headers: getAuthHeaders(),
      });
      const updatedReviews = await updatedRes.json();
      setReviews(updatedReviews);
      setNewReview({ rating: 1, comment: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isVolunteer) return <p>Only volunteers can write reviews.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Rating</label>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
              className={`px-3 py-1 rounded ${
                newReview.rating >= num ? 'bg-yellow-400 text-white' : 'bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
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
        disabled={submitting || !newReview.comment.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Previous Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map(r => (
            <div key={r._id} className="mb-4 p-3 border rounded">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{r.user?.name}</span>
                <span className="px-2 py-1 bg-yellow-400 text-white rounded">{r.rating}</span>
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
