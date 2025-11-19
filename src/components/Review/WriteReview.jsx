import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { Star } from 'lucide-react';

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

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [hover, setHover] = useState(0); // هنا يكون داخل component
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const renderStars = (rating, interactive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <div
          key={star}
          onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: star }))}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className="cursor-pointer"
        >
          <Star
            size={32}
            className={`${
              star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } transition-colors`}
          />
        </div>
      ))}
    </div>
  );

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
          event: eventId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      navigate(`/events/${eventId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'volunteer') {
    return <p>Only volunteers can write reviews.</p>;
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
          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !newReview.comment.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default WriteReview;
