const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/events`;
const APPLICATIONS_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/applications`;

const showAllEvents = async (query) => {
    try {
        // assigns query's value to filterObj if truthy (exists), otherwise, it will be an empty object
        const filterObj = query || {}; 
        // if keys exits (filters), then query string will be used, other wise it will return an empty string (to retrieve all events)
        const filterString = Object.keys(filterObj).length? `?${new URLSearchParams(filterObj).toString()}` : '';

        const res = await fetch(`${BASE_URL}${filterString}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const showEvent = async (eventId) => {
    try {
        const res = await fetch(`${BASE_URL}/${eventId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

const createEvent = async (eventFormData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventFormData)
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const applyForEvent = async (eventId) => {
    try {
        const res = await fetch(`${BASE_URL}/${eventId}/apply`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return res.json();
    } catch (error) {
        console.log(error);
    }
};

export const deleteEvent = async (eventId) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACK_END_SERVER_URL}/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    return await res.json();
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const updateEvent = async (eventId, updatedData) => {
  try {
    const res = await fetch(`${BASE_URL}/${eventId}`, {
      method: 'PUT', // <-- use PUT here
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    return res.json();
  } catch (err) {
    console.error(err);
  }
};



export {
    createEvent,
    showAllEvents,
    showEvent,
    applyForEvent,
    updateEvent 
    
}
