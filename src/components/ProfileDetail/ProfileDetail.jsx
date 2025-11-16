import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";

import { UserContext } from '../../contexts/UserContext';
import * as profileService from '../../services/profileService';

import ProfileView from '../../components/Profile/ProfileView';
import ProfileForm from '../../components/Profile/ProfileForm';


const ProfileDetail = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('view');

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProfile(userId);
            setProfile(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error fetching profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSuccess = async (updatedData) => {
        setProfile(updatedData);
        setIsEditing(false);
    };

    const isOwnProfile = user && profile && user._id === profile._id;

    if (loading) {
        return (
            <div className="text-center p-6">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading Profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">
                    ← Go Back
                </button>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <p className="text-gray-600">Profile not found.</p>
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

                    {profile.role === 'organization' && (
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
                isEditing ? (
                    <ProfileForm
                        profileData={profile}
                        onSuccess={handleUpdateSuccess}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <ProfileView
                        profileData={profile}
                        isOwnProfile={isOwnProfile}
                        onEditClick={() => setIsEditing(true)}
                    />
                )
            )}

            {activeTab === 'reviews' && profile.role === 'organization' && (
                <>
                    <ReviewForm organizationId={profile._id} />
                    <p className="text-gray-600">Reviews will go here...</p>
                </>
            )}
        </div>
    );
};

export default ProfileDetail;
