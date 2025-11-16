
import React from "react";
import * as dashboardService from "../../services/dashboardService.js";
import styles from './Dashboard.module.css';

const OrganizationDashboardCard = ({ application, onStatusUpdate }) => {

  const volunteer = application.volunteer;



  const handleApprove = async () => {
    await dashboardService.updateApplicationStatus(application._id, "approved");
    onStatusUpdate(application._id, "approved");

  };

  const handleReject = async () => {
    await dashboardService.updateApplicationStatus(application._id, "rejected");
    onStatusUpdate(application._id, "rejected");

  };

  const handlecomplete = async () => {
    await dashboardService.updateApplicationStatus(application._id, "completed");
    onStatusUpdate(application._id, "completed");

  };
  return (
    <div key={application._id} className={styles.dashboardCard}>
      <h2 className={styles.cardTitle}>{application.event.title}</h2>
      <p>Date: {new Date(application.event.date).toLocaleDateString()}</p>
      <p>Location: {application.event.location}</p>
      <p>Max Volunteers: {application.event.maxVolunteers}</p>
      <p>Volunteering Hours: {application.hours}</p>

      <h2>Volunteer Details</h2>
      <p>Name: {volunteer.name}</p>
      <p>Total Volunteering Hours: {volunteer.totalHours}</p>
      <p>Status: {application.status}</p>

      <div className={styles.row}>
        <button onClick={handleApprove} disabled={application.status === "approved"} className={styles.approveBtn}>
          Approve
        </button>
        <button onClick={handleReject} disabled={application.status === "rejected"} className={styles.rejectBtn}>
          Reject
        </button>
        <button onClick={handlecomplete} disabled={application.status === "completed"} className={styles.completeBtn}>
          Complete
        </button>
      </div>


    </div>
  );
};

export default OrganizationDashboardCard;

