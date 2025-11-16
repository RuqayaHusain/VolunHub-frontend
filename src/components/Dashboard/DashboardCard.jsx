const DashboardCard = ({ application }) => {
  if (!application || !application.event) return null;

  return (
    <div key={application._id}>
      <h3>{application.event.title}</h3>
      <p>Date: {new Date(application.event.date).toLocaleDateString()}</p>
      <p>Location: {application.event.location}</p>
      <p>Volunteering Hours: {application.hours}</p>
      <p>Status: {application.status}</p>
    </div>
  );
};

export default DashboardCard;

