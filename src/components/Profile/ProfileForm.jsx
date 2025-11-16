import { useState } from "react";
import * as profileService from '../../services/profileService';

const ProfileForm = ({ profile, userId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    profilePicture: profile.profilePicture || '',
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const updated = await profileService.updateProfile(userId, formData);
      onSave(updated);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <label>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Bio</label>
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
      />

      <label>Profile Picture URL</label>
      <input
        type="text"
        name="profilePicture"
        value={formData.profilePicture}
        onChange={handleChange}
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>

    </form>
  );
};

export default ProfileForm;
