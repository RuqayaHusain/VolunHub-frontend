 const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/dashboard`;

  export const getVolunteerApplications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/volunteer`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      const data = await res.json();
      // Normalize: if backend returns an array, wrap it so callers can use data.applications
      if (Array.isArray(data)) return { applications: data };
      return data.applications ? data : { applications: [] };
    } catch (error) {
      console.error("Error fetching volunteer applications:", error);
      return { applications: [] };
    }
  };

  export const getOrganizationApplications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/organization`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      const data = await res.json();
      if (Array.isArray(data)) return { applications: data };
      return data.applications ? data : { applications: [] };
    } catch (error) {
      console.error("Error fetching organization applications:", error);
      return { applications: [] };
    }
  };
  
    export const getEventById = async (eventId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACK_END_SERVER_URL}/events/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching event by id:", error);
      throw error;
    }
  };
  


export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/applications/${applicationId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

     if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching event by id:", error);
      throw error;
    }
  };