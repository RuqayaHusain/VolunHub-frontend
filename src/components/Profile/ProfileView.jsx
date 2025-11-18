import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { Save } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const ProfileView = ({ userId, isOwnProfile = false }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const endpoint = isOwnProfile 
        ? `${API_BASE_URL}/users/current-user`
        : `${API_BASE_URL}/users/${userId}`;
      
      const response = await fetch(endpoint, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <div className="relative">
              <img
                src={profile.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=128&background=random`}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                profile.role === 'volunteer' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.role === 'volunteer' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
              </div>
              <p className="text-gray-600">@{profile.username}</p>
            </div>

       
          {isOwnProfile && (
            <Link 
                to="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
            <Edit2 size={18} />
            Edit Profile
             </Link>
            )}
          </div>

    
          {profile.role === 'volunteer' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.totalHours || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        
          {profile.bio && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;