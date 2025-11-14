import { useNavigate } from "react-router";

const EventCard = (props) => {
    const navigate = useNavigate();

    return (
        <div key={props.event._id}>
            <h3>{props.event.title}</h3>
            <p>Category: {props.event.category}</p>
            <p>Location: {props.event.location}</p>
            <p>Date: {new Date(props.event.date).toLocaleDateString()}</p>
            <button onClick={() => navigate(`/events/${props.event._id}`)}>View Details</button>
        </div>
    );

};

export default EventCard;