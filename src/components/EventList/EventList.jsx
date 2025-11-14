import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as eventService from '../../services/eventService';
import EventFilter from "../EventFilter/EventFilter";


const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState({
        title: '',
        category: '',
        location: '',
        startDate: '',
        endDate: '',
    });
    const [validationMessage, setValidationMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const eventData = await eventService.showAllEvents(filter);
            setEvents(eventData);
        };
        fetchEvents();
    }, [filter]);



    return (
        <main>
            <h1>Events</h1>
            <button onClick={() => navigate('/events/new')}>
                Create Event
            </button>

            <EventFilter
                filter={filter}
                setFilter={setFilter}
                validationMessage={validationMessage}
                setValidationMessage={setValidationMessage}
            />

            <section>
                {events.map((event) => (
                    <div key={event._id}>
                        <h3>{event.title}</h3>
                        <p>Category: {event.category}</p>
                        <p>Location: {event.location}</p>
                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                        <button onClick={() => navigate(`/events/${event._id}`)}>View Details</button>
                    </div>
                ))}
            </section>

        </main>
    );
};

export default EventList;