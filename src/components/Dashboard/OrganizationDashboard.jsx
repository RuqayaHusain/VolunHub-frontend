import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as dashboardService from "../../services/dashboardService.js";
import OrganizationDashboardCard from "./OrganizationDashboardCard.jsx";
import styles from './Dashboard.module.css';

const OrganizationDashboard = () => {
  const { user } = useContext(UserContext);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        const data = await dashboardService.getOrganizationApplications();
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchApplications();
  }, [user]);

  const handleStatusUpdate = (applicationId, newStatus) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  const events = [];
  const eventIds = new Set();
  applications.forEach((app) => {
    if (app.event && !eventIds.has(app.event._id)) {
      eventIds.add(app.event._id);
      events.push(app.event);
    }
  });

  return (
    <main className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Volunteers Applied to Your Events</h1>
      {events.length === 0 ? (
        <p className={styles.emptyMessage}>No events found.</p>
      ) : (
        <>
          <h2 className={styles.dashboardSubTitle}>Your Events</h2>
          <br />
          <div className={styles.cardContainer}>
            {events.map((ev) => {
              const applicantsCount = applications.filter(
                (app) => app.event?._id === ev._id
              ).length;
              return (
                <div key={ev._id} onClick={() => navigate(`/events/${ev._id}`)} className={styles.eventCard}>
                  <h3>{ev.title}</h3>
                  <p>{new Date(ev.date).toLocaleDateString()}</p>
                  <p>Applicants: {applicantsCount}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
      <br />
      <h2 className={styles.dashboardSubTitle}>All Applications</h2>
      <br />
      {applications.length === 0 ? (
        <p className={styles.emptyMessage}>No volunteers have applied to your events yet.</p>
      ) : (
        <div className={styles.cardContainer}>
          {applications.map((app) => (
            <OrganizationDashboardCard
              key={app._id}
              application={app}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default OrganizationDashboard;
