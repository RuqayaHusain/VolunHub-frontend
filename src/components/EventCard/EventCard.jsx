import { Link } from "react-router";

const EventCard = (props) => {

    return (
        <div key={props.event._id}>
            <h3>{props.event.title}</h3>
            <p>Category: {props.event.category}</p>
            <p>Location: {props.event.location}</p>
            <p>Date: {new Date(props.event.date).toLocaleDateString()}</p>
            <Link to={`/events/${props.event._id}`}>View Details</Link>
        </div>
    );

};

export default EventCard;