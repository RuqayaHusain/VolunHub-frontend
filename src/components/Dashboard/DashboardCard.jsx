const DashboardCard = ({ application }) => {
  if (!application) return null;

  const event = application.event;

  return (
    <div key={application._id} >
      <h3>{event ? event.title : "Event not available"}</h3>

      {event ? (
        <>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
        </>
      ) : (
        <p>Event details not available</p>
      )}

      <p>Volunteering Hours: {application.hours ?? "N/A"}</p>
      <p>Status: {application.status ?? "N/A"}</p>
    </div>
  );
};

export default DashboardCard;
