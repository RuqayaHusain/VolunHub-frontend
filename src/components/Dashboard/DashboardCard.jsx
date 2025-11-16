import styles from './Dashboard.module.css';

const DashboardCard = ({ application }) => {
  if (!application) return null;

  const event = application.event;

    const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      case 'completed':
        return styles.statusCompleted;
      default:
        return '';
    }
  };

  return (
    <div key={application._id} className={styles.dashboardCard}>
      <h3 className={styles.cardTitle}>{event ? event.title : "Event not available"}</h3>

      {event ? (
        <>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
        </>
      ) : (
        <p>Event details not available</p>
      )}

      <p>Volunteering Hours: {application.hours ?? "N/A"}</p>
      <p>Status: <span className={getStatusClass(application.status)}>{application.status ?? "N/A"}</span></p>
    </div>
  );
};

export default DashboardCard;
