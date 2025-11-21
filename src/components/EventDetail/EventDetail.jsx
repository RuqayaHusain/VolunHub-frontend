import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import * as eventService from '../../services/eventService';
import styles from './EventDetail.module.css';
import ReviewForm from '../Review/WriteReview';

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

    const handleDelete = async () => {
        await eventService.deleteEvent(eventId);
        navigate('/events');
    };


    const handleUpdate = () => {
        navigate(`/events/edit/${eventId}`);
    };


 return (
        <main className={styles.container}>
            <h1 className={styles.title}>{event.title}</h1>
            <p className={styles.info}><strong>Description:</strong> {event.description}</p>
            <p className={styles.info}><strong>Location:</strong> {event.location}</p>
            <p className={styles.info}><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p className={styles.info}><strong>Duration:</strong> {event.duration} hours</p>
            <p className={styles.info}><strong>Max Volunteers:</strong> {event.maxVolunteers}</p>

            {validationMessage && <p className={styles.error}>{validationMessage}</p>}

            <div className={styles.buttonGroup}>
                {isVolunteer &&
                    <button
                        onClick={handleApply}
                        disabled={isApplying || isExpired || isFull}
                        className={styles.applyBtn}
                    >
                        {isExpired ? 'Event Expired' : (isFull ? 'Applications Closed' : (isApplying ? 'Applying...' : 'Apply to Event'))}
                    </button>
                }

                {user.role === 'organization' && (
                    <>
                        <button onClick={handleUpdate} className={styles.updateBtn}>Update Event</button>
                        <button onClick={handleDelete} className={styles.deleteBtn}>Delete Event</button>
                    </>
                )}
            </div>
                 <div className={styles.reviewsSection} style={{ marginTop: '50px' }}>
                        {isVolunteer && (
                         <Link
                             to={`/events/${eventId}/write-review`}
                             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                         >
                             Write a Review
                                    </Link>
                                )}

                         {user.role === 'organization' && (
                             <Link
                              to={`/reviews/${eventId}`} // This should point to your WriteReview component page
                             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4"
                            >
                            View Reviews
                        </Link>
                        )}

            </div>

        </main>
    );

};

export default EventDetail;