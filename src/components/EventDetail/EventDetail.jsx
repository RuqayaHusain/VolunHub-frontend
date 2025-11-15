import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as eventService from '../../services/eventService';

const EventDetail = () => {
    const { eventId } = useParams();
    const { user } = useContext(UserContext);

    const [event, setEvent] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const navigate = useNavigate(); 
    const isVolunteer = user.role === 'volunteer' ? true : false;

    useEffect(() => {
        const fetchEvent = async () => {
            const eventData = await eventService.showEvent(eventId);
            setEvent(eventData);
        };
        if (eventId) fetchEvent();
    }, [eventId]);

    const handleApply = async () => {
        setIsApplying(true);
        setValidationMessage('');
        const res = await eventService.applyForEvent(eventId);
        if (res.err) {
            setValidationMessage(res.err);
        } else {
            setValidationMessage('Application submitted! Pending approval');
        }
        setIsApplying(false);
    };

 const handleDelete = async () => {
    try {
        await eventService.deleteEvent(eventId);
        navigate('/events');
    } catch (err) {
    }
};


    const handleUpdate = () => {
        navigate(`/events/edit/${eventId}`);
    };

    if (!event) return <h3>Loading ...</h3>

    return (
        <main>
            <h1>{event.title}</h1>
            <p>Description: {event.description}</p>
            <p>Location: {event.location}</p>
            <p>Date: {event.date}</p>
            <p>Duration: {event.duration}</p>
            <p>Max Volunteers: {event.maxVolunteers}</p>

            {isVolunteer &&

                <button
                    onClick={handleApply}
                    disabled={isApplying}
                >
                    {isApplying ? 'Applying...' : 'Apply to Event'}

                </button>

            }

            {user.role === 'organization' && (
                <>
                    <button onClick={handleUpdate}>Update Event</button>
                    <button onClick={handleDelete}>Delete Event</button>
                </>
            )}

            {validationMessage && <p>{validationMessage}</p>}
        </main>
    );

};

export default EventDetail;


