const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const getCurrentUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/current-user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (profileData) => {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  getCurrentUser,
  getUserById,
  updateProfile,
};