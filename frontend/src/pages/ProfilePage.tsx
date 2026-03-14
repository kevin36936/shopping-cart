import { useUser } from "../contexts/UserContext";

const ProfilePage = () => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>No user data available.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-700">
        <strong>Email:</strong> {user.email}
      </p>
      {/* Add more profile fields later */}
    </div>
  );
};

export default ProfilePage;
