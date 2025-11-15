import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as eventService from '../../services/eventService';
import EventFilter from "../EventFilter/EventFilter";
import EventCard from "../EventCard/EventCard";
import { UserContext } from "../../contexts/UserContext";


const EventList = () => {
    const { user } = useContext(UserContext);
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

    const isOrganization = user.role === 'organization';

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
            {isOrganization && (
                <button onClick={() => navigate('/events/new')}>
                    Create Event
                </button>
            )}

            <EventFilter
                filter={filter}
                setFilter={setFilter}
                validationMessage={validationMessage}
                setValidationMessage={setValidationMessage}
            />

            <section>
                {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
            </section>

        </main>
    );
};

export default EventList;