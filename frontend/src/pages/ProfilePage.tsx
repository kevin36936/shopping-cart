import { useUser } from "../contexts/UserContext";

const ProfilePage = () => {
  const { user, loading } = useUser();

  if (loading) return <div className="text-gray-500">Loading profile...</div>;
  if (!user)
    return <div className="text-gray-500">No user data available.</div>;

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Email
          </p>
          <p className="text-gray-900 font-medium">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
