import { Link } from "react-router";
import styles from './EventCard.module.css';

const EventCard = (props) => {

    return (
        <div key={props.event._id} className={styles.card}>
            <h3 className={styles.title}>{props.event.title}</h3>
            <p className={styles.info}><strong>Category:</strong> {props.event.category}</p>
            <p className={styles.info}><strong>Location:</strong> {props.event.location}</p>
            <p className={styles.info}><strong>Date:</strong> {new Date(props.event.date).toLocaleDateString()}</p>
            <Link to={`/events/${props.event._id}`} className={styles.link}>View Details</Link>
        </div>
    );

};

export default EventCard;