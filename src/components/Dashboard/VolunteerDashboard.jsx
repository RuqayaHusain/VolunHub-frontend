
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as dashboardService from "../../services/dashboardService.js";
import DashboardCard from './DashboardCard.jsx';

const VolunteerDashboard = () => {
  const { user } = useContext(UserContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const data = await dashboardService.getVolunteerApplications();
      setApplications(data.applications || []);
    };

    if (user) fetchApplications();
  }, [user]);

  const uniqueEvents = Array.from(
    applications.reduce((map, app) => {
      if (app.event && !map.has(app.event._id)) {
        map.set(app.event._id, app);
      }
      return map;
    }, new Map()).values()
  );

  return (
    <main>
      <h1>My Applications</h1>

      {uniqueEvents.length === 0 ? (
        <p>You haven’t applied to any events yet.</p>
      ) : (
        <div>
          {uniqueEvents.map((app) => (
            <DashboardCard key={app._id} application={app} />
          ))}
        </div>
      )}
    </main>
  );
};


export default VolunteerDashboard;

