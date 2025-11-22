import { useState, useEffect } from 'react';
import { Link } from "react-router";
import { Edit2, Clock } from "lucide-react";
import styles from './ProfileView.module.css';
import * as userService from '../../services/userService';

const ProfileView = ({ userId, isOwnProfile = false }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId && !isOwnProfile) return;
    fetchProfile();
  }, [userId, isOwnProfile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = isOwnProfile 
        ? await userService.getCurrentUser()
        : await userService.getUserById(userId);

      setProfile(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );

  if (error) return (
    <div className={styles.errorContainer}>
      <div className={styles.errorAlert}>
        <strong>Profile load error:</strong> {error}
      </div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.coverBanner}></div>
        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              <img
                src={profile.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=128&background=random`}
                alt={profile.name}
                className={styles.avatar}
              />
              <div className={`${styles.statusBadge} ${styles[profile.role]}`}></div>
            </div>

            <div className={styles.profileInfo}>
              <div className={styles.profileNameRow}>
                <h1 className={styles.profileName}>{profile.name}</h1>
                <span className={`${styles.roleBadge} ${styles[profile.role]}`}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
              </div>
              <p className={styles.username}>@{profile.username}</p>
            </div>

            {isOwnProfile && (
              <Link to="/profile/edit" className={styles.editButton}>
                <Edit2 size={18} />
                Edit Profile
              </Link>
            )}
          </div>

          {profile.role === 'volunteer' && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <Clock className={styles.statIcon} size={24} />
                  <div>
                    <p className={styles.statLabel}>Total Hours</p>
                    <p className={styles.statValue}>{profile.totalHours || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {profile.bio && (
            <div className={styles.bioSection}>
              <h2 className={styles.bioTitle}>About</h2>
              <p className={styles.bioText}>{profile.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;