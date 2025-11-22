const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/reviews`;

const getReviewsByEvent = async (eventId) => {
  try {
    const res = await fetch(`${BASE_URL}/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const createReview = async (reviewData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  getReviewsByEvent,
  createReview,
};