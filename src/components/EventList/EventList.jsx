import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as eventService from '../../services/eventService';


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

    const handleChange = (evt) => {
        const { name, value } = evt.target;

        const newFilter = { ...filter, [name]: value };

        if (newFilter.startDate && newFilter.endDate) {
            if (newFilter.startDate > newFilter.endDate) {
                newFilter.startDate = "";
                newFilter.endDate = "";
                setValidationMessage('End date must be after start date');
            } else {
                setValidationMessage('');
            }
        } else {
            setValidationMessage('');
        }
        setFilter(newFilter);

    };

    return (
        <main>
            <h1>Events</h1>
            {validationMessage && <p>{validationMessage}</p>}
            <section>
                <h2>Filter</h2>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={filter.title}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="Location"
                    value={filter.location}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    placeholder="Start Date"
                    value={filter.startDate}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    placeholder="End Date"
                    value={filter.endDate}
                    onChange={handleChange}
                />
                <select
                    name="category"
                    id="category"
                    placeholder="Category"
                    value={filter.category}
                    onChange={handleChange}
                >
                    <option value="Community Service">Community Service</option>
                    <option value="Education">Education</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Animal Care">Animal Care</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Sports & Recreation">Sports & Recreation</option>
                    <option value="Human Rights">Human Rights</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Technology">Technology</option>
                    <option value="Fundraising">Fundraising</option>
                    <option value="Elderly Support">Elderly Support</option>
                    <option value="Youth Empowerment">Youth Empowerment</option>
                    <option value="Food Distribution">Food Distribution</option>
                    <option value="Other">Other</option>
                </select>

            </section>

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