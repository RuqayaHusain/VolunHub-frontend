const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/events`;

const ShowAllEvents = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

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
}