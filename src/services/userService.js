const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;
const  headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }

export const index = async () => {
   try {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

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