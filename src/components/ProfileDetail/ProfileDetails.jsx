import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../../contexts/UserContext';

const ProfileDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProfile(userId);
            setProfileData(data);
            setError('');
        
        } catch(err){
            setError(err.message || 'Error fetching profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSuccess = async (updatedData) => {
        setProfileData(updatedData);
        setIsEditing(false);
    };

    const is0wneProfile =  user && profileData && user.id === profileData._id;

    if (loading) {
        return (
            <div className="test">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto">
                    <p className="text-gray-600">Loading Profile</p>
                    </div>  
                </div>
            </div>
        );
    }

    if(error){
        return (
       <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Go Back
        </button>
      </div>
      );
    }

    if (!profileData) {
        return (
        <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Profile not found</p>
        </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
             <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'view'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Profile
          </button>
          {profileData.role === 'organization' && (
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Reviews & Feedback
            </button>
          )}
        </div>
      </div>

            {activeTab === 'view' && (
        <>
          {isEditing ? (
            <ProfileUpdate
              profileData={profileData}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView
              profileData={profileData}
              isOwnProfile={isOwnProfile}
              onEditClick={() => setIsEditing(true)}
            />
          )}
        </>
      )}

      {activeTab === 'reviews' && profileData.role === 'organization' && (
        <ReviewProfile organizationId={profileData._id} />
      )}
    </div>
  );
};

export default ProfileDetail;