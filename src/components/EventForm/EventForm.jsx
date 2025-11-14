import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as eventService from '../../services/eventService';

const EventForm = (props) => {
    const { eventId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Community Service',
        location: '',
        date: '',
        duration: 0,
        maxVolunteers: 0,
    });

    useEffect(() => {
        const fetchEvent = async () => {
            const eventData = await eventService.showEvent(eventId);
            setFormData({
                ...eventData,
                date: eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : '',
            });
        };
        if (eventId) fetchEvent();

        return () => setFormData({
            title: '',
            description: '',
            category: 'Community Service',
            location: '',
            date: '',
            duration: 0,
            maxVolunteers: 0,
        });
    }, [eventId]);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (eventId) {
            props.handleUpdateEvent(eventId, formData);
        } else {
            props.handleAddEvent(formData);
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    id="description"
                    cols="10"
                    rows="10"
                    value={formData.description}
                    onChange={handleChange}
                />

                <label htmlFor="category">Category</label>
                <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}>

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

                <label htmlFor="location">Location</label>
                <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                />

                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                />

                <label htmlFor="duration">Duration (hours)</label>
                <input
                    type="number"
                    name="duration"
                    id="duration"
                    value={formData.duration}
                    onChange={handleChange}
                />

                <label htmlFor="maxVolunteers">Max Volunteers</label>
                <input
                    type="number"
                    name="maxVolunteers"
                    id="maxVolunteers"
                    value={formData.maxVolunteers}
                    onChange={handleChange}
                />

                <button type="submit">{eventId ? 'Update Event' : 'Create Event'}</button>
            </form>
        </main>
    );

};

export default EventForm;