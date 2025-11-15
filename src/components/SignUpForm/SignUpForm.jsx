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
    password: '',
    passwordConf: '',
    rele:'volunteer',
    name:'',
    bio:'',
    profilePicture:''
  });


  const { username, password, passwordConf, role, name, bio, profilePicture } = formData;

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
    return !(username && password && password === passwordConf);
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='role'>I am:</label>
          <select
            id='role'
            name='role'
            value={role}
            onChange={handleChange}
            required
          >
          <option value='volunteer'>volunteer</option>
          <option value='organization'>organization</option>
          </select>
        </div>


         <div>
          <label htmlFor='name'>
            {role === 'volunteer' ? 'Full Name:' : 'Organization Name:'}
          </label>
          <input
            type='text'
            id='name'
            value={name}
            name='name'
            onChange={handleChange}
            placeholder={role === 'volunteer' ? 'Ahmed Ali' : 'Green Earth Initiative'}
            required
          />
        </div>
        
        
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            name='username'
            onChange={handleChange}
            placeholder='Choose a unique username'
            required
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
          <label htmlFor='bio'>
            {role === 'volunteer' ? 'About You (Optional):' : 'About Organization (Optional):'}
          </label>
          <textarea
            id='bio'
            name='bio'
            value={bio}
            onChange={handleChange}
            rows='4'
            placeholder={
              role === 'volunteer' 
                ? 'Tell us about yourself...' 
                : 'Describe your organization...'
            }
          />
        </div>

         <div>
          <label htmlFor='profilePicture'>Profile Picture URL (Optional):</label>
          <input
            type='url'
            id='profilePicture'
            name='profilePicture'
            value={profilePicture}
            onChange={handleChange}
            placeholder='https://example.com/image.jpg'
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
