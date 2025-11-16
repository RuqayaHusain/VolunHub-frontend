// Import the useContext hook
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { signUp } from '../../services/authService';

// Import the UserContext object
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  // Pass the UserContext object to the useContext hook to access:
  // - The user state (which we're not using here).
  // - The setUser function to update the user state (which we are using).
  //
  // Destructure the object returned by the useContext hook for easy access
  // to the data we added to the context with familiar names.
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: '',
    bio: '',
    profilePicture: '',
    password: '',
    passwordConf: '',
  });


  const {
    username,
    name,
    role,
    bio,
    profilePicture,
    password,
    passwordConf
  } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      // Call the setUser function to update the user state, just like normal.

      setUser(newUser);
      // Take the user to the (non-existent) home page after they sign up.
      // We'll get to this shortly!
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username
      && name
      && role
      && password
      && password === passwordConf);
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='name'>Full Name:</label>
          <input
            type='text'
            id='name'
            value={name}
            name='name'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='role'>Role:</label>
          <select
            id='role'
            name='role'
            value={role}
            onChange={handleChange}
            required
          >
            <option value=''></option>
            <option value='volunteer'>Volunteer</option>
            <option value='organization'>Organization</option>
          </select>
        </div>
        <div>
          <label htmlFor='bio'>Bio:</label>
          <textarea
            id='bio'
            name='bio'
            value={bio}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor='profilePicture'>Profile Picture (URL):</label>
          <input
            type='text'
            id='profilePicture'
            value={profilePicture}
            name='profilePicture'
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='confirm'>Confirm Password:</label>
          <input
            type='password'
            id='confirm'
            value={passwordConf}
            name='passwordConf'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;
