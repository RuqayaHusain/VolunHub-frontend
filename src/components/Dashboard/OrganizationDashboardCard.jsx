
import React from "react";
import { useNavigate } from "react-router";
import * as dashboardService from "../../services/dashboardService.js";

const OrganizationDashboardCard = ({ application, onDelete, onStatusUpdate }) => {
  const navigate = useNavigate();

    const volunteer = application.volunteer;

 

  const handleApprove = async () => {
    try {
      await dashboardService.updateApplicationStatus(application._id, "approved");
      onStatusUpdate(application._id, "approved"); 
    } catch (error) {
    }
  };

  const handleReject = async () => {
    try {
      await dashboardService.updateApplicationStatus(application._id, "rejected");
      onStatusUpdate(application._id, "rejected"); 
    } catch (error) {
    }
  };

   const handlecomplete = async () => {
    try {
      await dashboardService.updateApplicationStatus(application._id, "completed");
      onStatusUpdate(application._id, "completed"); 
    } catch (error) {
    }
  };
  return (
    <div key={application._id}>
      <h2>{application.event.title}</h2>
      <p>Date: {new Date(application.event.date).toLocaleDateString()}</p>
      <p>Location: {application.event.location}</p>
      <p>Max Volunteers: {application.event.maxVolunteers}</p>
      <p>Volunteering Hours: {application.hours}</p>

      <h2>Volunteer Details</h2>
      <p>Name: {volunteer.name}</p>
      <p>Email: {volunteer.email || "N/A"}</p>
     <p>Total Volunteering Hours: {volunteer.totalHours}</p>
      <p>Status: {application.status}</p>


      <button onClick={handleApprove} disabled={application.status === "approved"}>
        Approve
      </button>
      <button onClick={handleReject} disabled={application.status === "rejected"}>
        Reject
      </button>
      <button onClick={handlecomplete} disabled={application.status === "completed"}>
        complete
      </button>
 

    </div>
  );
};

export default OrganizationDashboardCard;

