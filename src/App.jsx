import { Routes, Route, Navigate, useNavigate } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import VolunteerDashboard from './components/Dashboard/VolunteerDashboard.jsx';
import { useContext, useState } from 'react';
import { UserContext } from './contexts/UserContext';
import EventList from './components/EventList/EventList';
import EventForm from './components/EventForm/EventForm';
import * as eventService from './services/eventService';
import EventDetail from './components/EventDetail/EventDetail';
import OrganizationDashboard from "./components/Dashboard/OrganizationDashboard.jsx";
import ProfileView from './components/Profile/ProfileView';
import ProfileEditForm from './components/Profile/ProfileEditForm';
import ReviewsPage from './components/Review/ReviewForm';



const App = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();  

  const handleAddEvent = async (eventFormData) => {
    const newEvent = await eventService.createEvent(eventFormData);
    setEvents([newEvent, ...events]);
    navigate('/events');
  };


    
   const handleUpdateEvent = async (eventId, updatedData) => {
  try {
    const updatedEvent = await eventService.updateEvent(eventId, updatedData);
    setEvents(events.map(ev => (ev._id === eventId ? updatedEvent : ev)));
    navigate('/events');
  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      <NavBar />

        <Routes>
      {
        user ?
        <>
          {
            user.role === "organization"
              ? <Route path='/' element={<OrganizationDashboard />} />
              : <Route path='/' element={<VolunteerDashboard />} />
          }
          <Route path='/events' element={<EventList />} />
          <Route path='/events/new' element={<EventForm handleAddEvent={handleAddEvent} />} />
          <Route path='/events/edit/:eventId'element={<EventForm handleUpdateEvent={handleUpdateEvent} />}/>
          <Route path='/events/:eventId' element={<EventDetail />} />
          <Route path='/profile' element={<ProfileView isOwnProfile={true} />} />
          <Route path='/profile/edit' element={<ProfileEditForm />} />
          <Route path='/profile/:userId' element={<ProfileView isOwnProfile={false} />} />
          <Route path='/events/:eventId/reviews' element={<ReviewsPage />} />


            
          </>
          
          :
          <Route path='/' element={<Landing />} />
        }

        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
}

export default App;