const ProfileView = ({ profile, isOwnProfile, onEdit }) => {
  return (
    <section>
      <img
        src={profile.profilePicture || 'https://via.placeholder.com/150'}
        alt="profile"
        width="150"
        height="150"
      />

      <h2>{profile.name}</h2>
      <p>@{profile.username}</p>
      <p>Role: {profile.role}</p>

      {profile.bio && <p>{profile.bio}</p>}

      {isOwnProfile && (
        <button onClick={onEdit}>
          Edit Profile
        </button>
      )}
    </section>
  );
};

export default ProfileView;
