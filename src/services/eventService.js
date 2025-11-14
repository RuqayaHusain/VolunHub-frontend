const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/events`;

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



export {
    createEvent,
    ShowAllEvents,
    showEvent,
}