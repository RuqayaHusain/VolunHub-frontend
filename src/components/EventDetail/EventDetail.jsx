import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as eventService from '../../services/eventService';

const EventDetail = () => {
    const { eventId } = useParams();
    const { user } = useContext(UserContext);

    const [event, setEvent] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    const isVolunteer = user.role === 'volunteer' ? true : false;

    useEffect(() => {
        const fetchEvent = async () => {
            const eventData = await eventService.showEvent(eventId);
            setEvent(eventData);
        };
        if (eventId) fetchEvent();
    }, [eventId]);

    if (!event) return <h3>Loading ...</h3>

    const isExpired = new Date(event.date) < new Date();
    const isFull = event.maxVolunteers === 0;
    
    const handleApply = async () => {
        setValidationMessage('');

        if (isExpired) return setValidationMessage('Event already ended');
        if (isFull) return setValidationMessage('Event is full');

        setIsApplying(true);

        const res = await eventService.applyForEvent(eventId);

        if (res.err) {
            setValidationMessage(res.err);
        } else {
            setValidationMessage('Application submitted! Pending approval');
        }
        setIsApplying(false);
    };


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
                    disabled={isApplying || isExpired || isFull}
                >
                    {
                        isExpired ? 'Event Expired' :
                            (isFull ? 'Applications Closed' :
                                (isApplying ? 'Applying...' : 'Apply to Event'))
                    }

                </button>

            }

            {validationMessage && <p>{validationMessage}</p>}

        </main>
    );

};

export default EventDetail;