import { useState, useEffect } from 'react';
import { X, Save } from "lucide-react";
import styles from './ProfileEditForm.module.css';
import * as userService from '../../services/userService';

const ProfileEditForm = () => {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const data = await userService.getCurrentUser();
      setProfile({
        name: data.name || '',
        bio: data.bio || '',
        profilePicture: data.profilePicture || ''
      });
      setImagePreview(data.profilePicture);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setProfile(prev => ({ ...prev, profilePicture: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profile.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      await userService.updateProfile(profile);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Profile</h1>
          <button
            onClick={() => window.history.back()}
            className={styles.closeButton}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            {error}
          </div>
        )}

        {success && (
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            Profile updated successfully! Redirecting...
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Profile Picture</label>
            <div className={styles.profilePictureSection}>
              <img
                src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&size=128&background=random`}
                alt="Profile preview"
                className={styles.profileImage}
              />
              <div className={styles.imageInputWrapper}>
                <input
                  type="url"
                  name="profilePicture"
                  value={profile.profilePicture}
                  onChange={handleImageChange}
                  placeholder="Enter image URL"
                  className={styles.input}
                />
                <p className={styles.hint}>Enter a URL to your profile picture</p>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="bio" className={styles.label}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              rows={5}
              className={styles.textarea}
              placeholder="Tell us about yourself..."
            />
            <p className={styles.charCount}>
              {profile.bio.length} characters
            </p>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={saving}
              className={styles.saveButton}
            >
              {saving ? (
                <>
                  <div className={styles.spinner}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;